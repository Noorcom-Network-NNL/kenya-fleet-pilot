-- Create the first super admin user
-- Note: Replace 'YOUR_USER_ID_HERE' with the actual UUID from auth.users table
-- You can find your user ID by running: SELECT id FROM auth.users WHERE email = 'admin@noorcomfleet.co.ke';

INSERT INTO public.admin_users (user_id, email, role, active, permissions)
VALUES (
  'YOUR_USER_ID_HERE'::uuid,
  'admin@noorcomfleet.co.ke', 
  'super_admin',
  true,
  ARRAY['all']
);

-- Alternative: If you want to auto-create based on existing auth user:
-- INSERT INTO public.admin_users (user_id, email, role, active, permissions)
-- SELECT id, email, 'super_admin', true, ARRAY['all']
-- FROM auth.users 
-- WHERE email = 'admin@noorcomfleet.co.ke'
-- LIMIT 1;