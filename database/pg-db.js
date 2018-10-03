const pg = require('pg');

const client = new pg.Client({
  user: 'sonia',
  host: 'localhost',
  database: 'hackazon',
  port: 5432,
  password: '',
});
client.connect((err) => {
  if (err) {
    console.log('connection error', err);
  } else {
    console.log('connected');
  }
});
exports.getProduct = (id, cb) => {
  client.query(`SELECT * FROM productInfo WHERE id=${id}`, cb);
};
