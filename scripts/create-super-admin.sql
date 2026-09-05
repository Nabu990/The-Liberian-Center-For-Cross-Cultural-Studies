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
  '$2a$12$XYvSndYpPvvU56RS2J4IEuxg.nf7K6khjWGSQmivmpL/BkY6zcmIm',
  'Super',
  'Admin',
  'SUPER_ADMIN',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'SUPER_ADMIN',
  password = '$2a$12$XYvSndYpPvvU56RS2J4IEuxg.nf7K6khjWGSQmivmpL/BkY6zcmIm',
  "isActive" = true;