-- Create the first super admin user by finding existing auth user
-- This will create the admin record for the user with email admin@noorcomfleet.co.ke
-- if they exist in the auth.users table

INSERT INTO public.admin_users (user_id, email, role, active, permissions)
SELECT 
  au.id,
  'admin@noorcomfleet.co.ke',
  'super_admin',
  true,
  ARRAY['all']
FROM auth.users au
WHERE au.email = 'admin@noorcomfleet.co.ke'
AND NOT EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE user_id = au.id
)
LIMIT 1;