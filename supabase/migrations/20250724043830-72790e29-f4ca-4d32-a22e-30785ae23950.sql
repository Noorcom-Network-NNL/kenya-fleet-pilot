-- Extend organizations table for white-label branding
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#3b82f6';
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#1e40af';
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#06b6d4';
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS custom_domain TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS custom_css TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS white_label_enabled BOOLEAN DEFAULT false;

-- Create admin_users table for super admin access
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin', -- 'super_admin', 'admin', 'support'
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organization_metrics table for tracking usage
CREATE TABLE public.organization_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  active_users INTEGER DEFAULT 0,
  total_vehicles INTEGER DEFAULT 0,
  total_drivers INTEGER DEFAULT 0,
  fuel_records_count INTEGER DEFAULT 0,
  maintenance_records_count INTEGER DEFAULT 0,
  trip_records_count INTEGER DEFAULT 0,
  storage_used_mb DECIMAL(10,2) DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, metric_date)
);

-- Create billing_events table for payment tracking
CREATE TABLE public.billing_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'subscription_created', 'payment_success', 'payment_failed', 'subscription_cancelled'
  stripe_event_id TEXT,
  amount INTEGER, -- in cents
  currency TEXT DEFAULT 'usd',
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;

-- Create security functions for admin access
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND role = 'super_admin' AND active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin') AND active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

-- Admin RLS policies
CREATE POLICY "Super admins can view all admin users" 
ON public.admin_users FOR SELECT 
USING (public.is_super_admin());

CREATE POLICY "Super admins can manage admin users" 
ON public.admin_users FOR ALL 
USING (public.is_super_admin());

-- Organization metrics policies (admin access)
CREATE POLICY "Admins can view organization metrics" 
ON public.organization_metrics FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert organization metrics" 
ON public.organization_metrics FOR INSERT 
WITH CHECK (public.is_admin());

-- Billing events policies (admin access)
CREATE POLICY "Admins can view billing events" 
ON public.billing_events FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert billing events" 
ON public.billing_events FOR INSERT 
WITH CHECK (public.is_admin());

-- Update organization policies for admin access
CREATE POLICY "Admins can view all organizations" 
ON public.organizations FOR SELECT 
USING (
  public.is_admin() OR 
  owner_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND organization_id = organizations.id)
);

CREATE POLICY "Admins can update all organizations" 
ON public.organizations FOR UPDATE 
USING (
  public.is_admin() OR 
  owner_id = auth.uid()
);

-- Create storage buckets for branding assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('organization-logos', 'organization-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']),
  ('organization-assets', 'organization-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'text/css']);

-- Storage policies for branding assets
CREATE POLICY "Public can view organization assets"
ON storage.objects FOR SELECT
USING (bucket_id IN ('organization-logos', 'organization-assets'));

CREATE POLICY "Admins can upload organization assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('organization-logos', 'organization-assets') AND
  (public.is_admin() OR 
   EXISTS (
     SELECT 1 FROM public.profiles p 
     JOIN public.organizations o ON p.organization_id = o.id
     WHERE p.user_id = auth.uid() 
     AND p.role IN ('fleet_admin', 'fleet_manager')
     AND (storage.foldername(objects.name))[1] = o.id::text
   ))
);

CREATE POLICY "Admins can update organization assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id IN ('organization-logos', 'organization-assets') AND
  (public.is_admin() OR 
   EXISTS (
     SELECT 1 FROM public.profiles p 
     JOIN public.organizations o ON p.organization_id = o.id
     WHERE p.user_id = auth.uid() 
     AND p.role IN ('fleet_admin', 'fleet_manager')
     AND (storage.foldername(objects.name))[1] = o.id::text
   ))
);

CREATE POLICY "Admins can delete organization assets"
ON storage.objects FOR DELETE
USING (
  bucket_id IN ('organization-logos', 'organization-assets') AND
  (public.is_admin() OR 
   EXISTS (
     SELECT 1 FROM public.profiles p 
     JOIN public.organizations o ON p.organization_id = o.id
     WHERE p.user_id = auth.uid() 
     AND p.role IN ('fleet_admin', 'fleet_manager')
     AND (storage.foldername(objects.name))[1] = o.id::text
   ))
);

-- Create indexes for better performance
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_admin_users_role ON public.admin_users(role);
CREATE INDEX idx_organization_metrics_org_date ON public.organization_metrics(organization_id, metric_date);
CREATE INDEX idx_billing_events_organization_id ON public.billing_events(organization_id);
CREATE INDEX idx_billing_events_created_at ON public.billing_events(created_at);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();