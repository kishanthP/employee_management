const pool = require('./src/config/db');
pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['messages'])
  .then(res => console.log(JSON.stringify(res.rows, null, 2)))
  .catch(console.error)
  .finally(() => process.exit());
