import { Router } from 'express';

import { clean, getIp, getIps, insertIp } from './db.js';
import { getRequestIp, log } from './utils.js';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/get-all', async (req, res) => {
  try {
    const ips = await getIps();
    res.setHeader('content-type', 'application/json');
    res.send(ips);
  } catch (e) {
    log(req, (e as Error)?.message || 'Unable to /get-all');
    res.sendStatus(400);
  }
});

router.get('/get', async (req, res) => {
  try {
    const ip = await getIp();
    res.setHeader('content-type', 'text/plain');
    res.send(ip);
  } catch (e) {
    log(req, (e as Error)?.message || 'Unable to /get');
    res.sendStatus(400);
  }
});

router.post('/set', async (req, res) => {
  const ip = getRequestIp(req);
  try {
    await insertIp(ip);
    res.sendStatus(200);
  } catch (e) {
    log(req, (e as Error)?.message || 'Unable to /set');
    res.sendStatus(400);
  }
});

router.post('/ip/clean', async (_, res) => {
  const status = await clean();
  res.sendStatus(status);
});

export { router };
