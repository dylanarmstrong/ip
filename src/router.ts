import { Router } from 'express';

import { deleteOld, getIp, getIps, insertIp } from './db.js';
import { getRequestIp, log } from './utils.js';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/get-all', (req, res) => {
  try {
    const ips = getIps();
    res.setHeader('content-type', 'application/json');
    res.send(ips);
  } catch (e) {
    log(req, (e as Error)?.message || 'Unable to /get-all');
    res.sendStatus(400);
  }
});

router.get('/get', (req, res) => {
  try {
    const ip = getIp();
    res.setHeader('content-type', 'text/plain');
    res.send(ip);
  } catch (e) {
    log(req, (e as Error)?.message || 'Unable to /get');
    res.sendStatus(400);
  }
});

router.post('/set', (req, res) => {
  const ip = getRequestIp(req);
  try {
    insertIp(ip);
    res.sendStatus(200);
  } catch (e) {
    log(req, (e as Error)?.message || 'Unable to /set');
    res.sendStatus(400);
  }
});

router.post('/clean', (_, res) => {
  const status = deleteOld();
  res.sendStatus(status);
});

export { router };
