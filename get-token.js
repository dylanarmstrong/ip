const fs = require('fs');
const jwt = require('jsonwebtoken');

const private = fs.readFileSync('./private.pem');
const token = jwt.sign({}, private, { algorithm: 'RS256', expiresIn: '10s' });

console.log(`Bearer ${token}`);
