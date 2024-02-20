import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { readFileSync } from 'node:fs';

import { log } from '../utils.js';

const publicKey = readFileSync('./public.pem');

// Check that valid pass is present in headers
const isValidRequest = (authorization: string | undefined) => {
  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      jwt.verify(authorization.slice('Bearer '.length), publicKey);
      return true;
    } catch {
      // Ignore
    }
  }
  return false;
};

const checkAuthToken: RequestHandler = (req, res, next) => {
  if (isValidRequest(req.headers.authorization)) {
    next();
    return;
  }

  log(req, 'Invalid Auth');
  res.sendStatus(403);
};

export { checkAuthToken };
