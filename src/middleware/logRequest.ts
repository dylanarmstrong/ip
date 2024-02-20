import type { RequestHandler } from 'express';

import { log } from '../utils.js';

const logRequest: RequestHandler = (req, _, next) => {
  log(req, `/${req.originalUrl.split('/').at(-1)}`);
  next();
};

export { logRequest };
