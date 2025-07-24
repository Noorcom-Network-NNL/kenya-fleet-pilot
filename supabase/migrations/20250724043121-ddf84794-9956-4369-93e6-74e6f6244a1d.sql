-- Fix security warnings by setting search_path on functions
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS app_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.is_organization_owner(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = org_id AND owner_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

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
      COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'viewer')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';