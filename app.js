const redis = require('redis');

const client = redis.createClient();

client.on('ready', () => {
  console.log('Redis is ready');
});

client.on('error', (err) => {
  console.log('error', err);
});

module.exports = client;
