const pool = require('./src/config/db');
pool.query(`
  DROP TABLE IF EXISTS message_reads CASCADE;
  DROP TABLE IF EXISTS messages CASCADE;
  DROP TABLE IF EXISTS group_members CASCADE;
  DROP TABLE IF EXISTS groups CASCADE;
  DROP TABLE IF EXISTS conversations CASCADE;
`)
  .then(() => console.log('Dropped chat tables successfully'))
  .catch(console.error)
  .finally(() => process.exit());
