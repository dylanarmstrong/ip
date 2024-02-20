import type { RequestHandler } from 'express';

import { log } from '../utils.js';

// Default to 400
const defaultPath: RequestHandler = (req, res) => {
  log(req, 'Invalid Path / Method');
  res.sendStatus(400);
};

export { defaultPath };
