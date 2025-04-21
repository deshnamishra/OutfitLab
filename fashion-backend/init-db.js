const fs = require('fs');
const db = require('./db');

console.log('Reading SQL file...');
const sql = fs.readFileSync('./database.sql').toString();
console.log('Executing SQL...');

db.query(sql, (err, result) => {
  if (err) throw err;
  console.log('✅ Database and tables created!');
  db.end();
});
