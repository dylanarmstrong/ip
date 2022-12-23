const fs = require('fs');
const jwt = require('jsonwebtoken');

const { pass } = require('./config.json');

const private = fs.readFileSync('./private.pem');
const token = jwt.sign({ pass }, private, { algorithm: 'RS256', expiresIn: '10s' });

console.log(`Bearer ${token}`);
