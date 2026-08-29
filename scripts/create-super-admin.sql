INSERT INTO "User" (
  id,
  email,
  password,
  "firstName",
  "lastName",
  role,
  "isEmailVerified",
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  'super-admin-001',
  'admin@lcccs.edu',
  '$2a$10$0Ot3t7gsqHalQoN3SK1U9eEz9ggMC7eIVQ4uFogKdF.IWjbjjrBKW',
  'Super',
  'Admin',
  'SUPER_ADMIN',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'SUPER_ADMIN',
  password = '$2a$10$0Ot3t7gsqHalQoN3SK1U9eEz9ggMC7eIVQ4uFogKdF.IWjbjjrBKW',
  "isActive" = true;