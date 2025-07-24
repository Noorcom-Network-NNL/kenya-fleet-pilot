-- Fleet Management System Database Schema (Fixed)
-- This creates all necessary tables with proper RLS policies for a multi-tenant SaaS application

-- Create custom types first
CREATE TYPE app_role AS ENUM ('fleet_admin', 'fleet_manager', 'driver', 'viewer');
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'idle', 'issue');
CREATE TYPE driver_status AS ENUM ('active', 'inactive');
CREATE TYPE driver_performance AS ENUM ('excellent', 'good', 'average', 'poor');
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'trial', 'cancelled');
CREATE TYPE maintenance_type AS ENUM ('routine', 'repair', 'inspection', 'oil_change', 'tire_change', 'other');
CREATE TYPE maintenance_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE trip_purpose AS ENUM ('business', 'personal', 'maintenance', 'delivery', 'other');
CREATE TYPE trip_status AS ENUM ('ongoing', 'completed', 'cancelled');

-- Organizations table (main tenant table)
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  subscription_status subscription_status NOT NULL DEFAULT 'trial',
  max_vehicles INTEGER NOT NULL DEFAULT 5,
  max_users INTEGER NOT NULL DEFAULT 3,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  owner_id UUID NOT NULL,
  owner_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  status driver_status NOT NULL DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  reg_number TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  status vehicle_status NOT NULL DEFAULT 'active',
  driver TEXT,
  fuel_level DECIMAL(5,2) DEFAULT 0,
  insurance TEXT,
  next_service DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, reg_number)
);

-- Drivers table
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  license TEXT NOT NULL,
  license_expiry DATE NOT NULL,
  status driver_status NOT NULL DEFAULT 'active',
  performance driver_performance NOT NULL DEFAULT 'good',
  assigned_vehicle TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fuel records table
CREATE TABLE public.fuel_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  vehicle_reg_number TEXT NOT NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  driver_name TEXT NOT NULL,
  fuel_amount DECIMAL(8,2) NOT NULL,
  fuel_cost DECIMAL(10,2) NOT NULL,
  price_per_liter DECIMAL(6,2) NOT NULL,
  odometer INTEGER NOT NULL,
  fuel_station TEXT NOT NULL,
  receipt_number TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Maintenance records table
CREATE TABLE public.maintenance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  vehicle_reg_number TEXT NOT NULL,
  type maintenance_type NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  mileage INTEGER NOT NULL,
  service_provider TEXT NOT NULL,
  status maintenance_status NOT NULL DEFAULT 'scheduled',
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  next_service_mileage INTEGER,
  parts_replaced TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trip records table
CREATE TABLE public.trip_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  vehicle_reg_number TEXT NOT NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  driver_name TEXT NOT NULL,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  start_mileage INTEGER NOT NULL,
  end_mileage INTEGER,
  distance DECIMAL(8,2),
  fuel_used DECIMAL(6,2),
  fuel_cost DECIMAL(8,2),
  purpose trip_purpose NOT NULL,
  status trip_status NOT NULL DEFAULT 'ongoing',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_records ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid recursive RLS issues
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS app_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_organization_owner(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = org_id AND owner_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Organizations RLS policies
CREATE POLICY "Users can view their own organizations" 
ON public.organizations FOR SELECT 
USING (
  owner_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND organization_id = organizations.id)
);

CREATE POLICY "Users can create organizations" 
ON public.organizations FOR INSERT 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Organization owners can update their organizations" 
ON public.organizations FOR UPDATE 
USING (owner_id = auth.uid());

CREATE POLICY "Organization owners can delete their organizations" 
ON public.organizations FOR DELETE 
USING (owner_id = auth.uid());

-- Profiles RLS policies
CREATE POLICY "Users can view profiles in their organization" 
ON public.profiles FOR SELECT 
USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Admins and managers can insert profiles in their organization" 
ON public.profiles FOR INSERT 
WITH CHECK (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins and managers can update profiles in their organization" 
ON public.profiles FOR UPDATE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

CREATE POLICY "Admins and managers can delete profiles in their organization" 
ON public.profiles FOR DELETE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

-- Vehicles RLS policies
CREATE POLICY "Users can view vehicles in their organization" 
ON public.vehicles FOR SELECT 
USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Admins and managers can insert vehicles" 
ON public.vehicles FOR INSERT 
WITH CHECK (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

CREATE POLICY "Admins and managers can update vehicles" 
ON public.vehicles FOR UPDATE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

CREATE POLICY "Admins and managers can delete vehicles" 
ON public.vehicles FOR DELETE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

-- Drivers RLS policies
CREATE POLICY "Users can view drivers in their organization" 
ON public.drivers FOR SELECT 
USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Admins and managers can insert drivers" 
ON public.drivers FOR INSERT 
WITH CHECK (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

CREATE POLICY "Admins and managers can update drivers" 
ON public.drivers FOR UPDATE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

CREATE POLICY "Admins and managers can delete drivers" 
ON public.drivers FOR DELETE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

-- Fuel records RLS policies
CREATE POLICY "Users can view fuel records in their organization" 
ON public.fuel_records FOR SELECT 
USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Authorized users can insert fuel records" 
ON public.fuel_records FOR INSERT 
WITH CHECK (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager', 'driver')
);

CREATE POLICY "Admins and managers can update fuel records" 
ON public.fuel_records FOR UPDATE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

CREATE POLICY "Admins and managers can delete fuel records" 
ON public.fuel_records FOR DELETE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

-- Maintenance records RLS policies
CREATE POLICY "Users can view maintenance records in their organization" 
ON public.maintenance_records FOR SELECT 
USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Admins and managers can insert maintenance records" 
ON public.maintenance_records FOR INSERT 
WITH CHECK (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

CREATE POLICY "Admins and managers can update maintenance records" 
ON public.maintenance_records FOR UPDATE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

CREATE POLICY "Admins and managers can delete maintenance records" 
ON public.maintenance_records FOR DELETE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

-- Trip records RLS policies
CREATE POLICY "Users can view trip records in their organization" 
ON public.trip_records FOR SELECT 
USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Authorized users can insert trip records" 
ON public.trip_records FOR INSERT 
WITH CHECK (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager', 'driver')
);

CREATE POLICY "Authorized users can update trip records" 
ON public.trip_records FOR UPDATE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager', 'driver')
);

CREATE POLICY "Admins and managers can delete trip records" 
ON public.trip_records FOR DELETE 
USING (
  organization_id = public.get_user_organization_id() AND
  public.get_user_role() IN ('fleet_admin', 'fleet_manager')
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX idx_vehicles_organization_id ON public.vehicles(organization_id);
CREATE INDEX idx_drivers_organization_id ON public.drivers(organization_id);
CREATE INDEX idx_fuel_records_organization_id ON public.fuel_records(organization_id);
CREATE INDEX idx_fuel_records_vehicle_id ON public.fuel_records(vehicle_id);
CREATE INDEX idx_maintenance_records_organization_id ON public.maintenance_records(organization_id);
CREATE INDEX idx_maintenance_records_vehicle_id ON public.maintenance_records(vehicle_id);
CREATE INDEX idx_trip_records_organization_id ON public.trip_records(organization_id);
CREATE INDEX idx_trip_records_vehicle_id ON public.trip_records(vehicle_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fuel_records_updated_at
  BEFORE UPDATE ON public.fuel_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_records_updated_at
  BEFORE UPDATE ON public.maintenance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trip_records_updated_at
  BEFORE UPDATE ON public.trip_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if user metadata contains organization info
  IF NEW.raw_user_meta_data->>'organization_id' IS NOT NULL THEN
    INSERT INTO public.profiles (
      user_id, 
      organization_id, 
      name, 
      email, 
      role
    )
    VALUES (
      NEW.id,
      (NEW.raw_user_meta_data->>'organization_id')::UUID,
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      NEW.email,
      COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'viewer')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();