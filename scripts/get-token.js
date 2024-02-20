import jwt from 'jsonwebtoken';
import { readFileSync } from 'node:fs';

const token = jwt.sign({}, readFileSync('./private.pem'), {
  algorithm: 'RS256',
  expiresIn: '10s',
});

// eslint-disable-next-line no-console
console.log(`Bearer ${token}`);
