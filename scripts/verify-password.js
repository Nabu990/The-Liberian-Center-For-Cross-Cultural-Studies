const bcrypt = require('bcryptjs');

const password = 'Admin@123'; // The password you want to test
const hash = '$2a$10$0Ot3t7gsqHalQoN3SK1U9eEz9ggMC7eIVQ4uFogKdF.IWjbjjrBKW'; // The hash from your SQL

// Verify if the password matches the hash
bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('Error comparing:', err);
    return;
  }
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('Match:', result ? '✓ YES' : '✗ NO');
  
  if (!result) {
    console.log('\nThe password does not match the hash.');
    console.log('You need to regenerate the hash with the correct password.');
  }
});
