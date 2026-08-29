const bcrypt = require('bcryptjs');

// Generate a bcrypt hash for your password
const password = 'Admin@123'; // Change this to your desired password
const saltRounds = 12; // Must match the SALT_ROUNDS in src/lib/password.ts

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('Password:', password);
  console.log('Bcrypt Hash (salt rounds = 12):', hash);
  console.log('\nCopy this hash and use it in the create-super-admin.sql file');
});
