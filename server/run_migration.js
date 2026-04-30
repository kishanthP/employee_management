const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function run() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'src/config/migration.sql'), 'utf8');
    await pool.query(sql);
    console.log('Migration completed inside db');
  } catch(e) {
    console.error('Migration error:', e.message);
  } finally {
    process.exit();
  }
}
run();
