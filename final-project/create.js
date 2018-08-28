// A file to create and ad-hoc token
// play around with it by chaning an exp value to be 1 minute and see it in action
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  {
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    username: 'tamas'
  }, 's3cr3t');

console.log(token);