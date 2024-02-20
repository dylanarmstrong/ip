import express from 'express';

import { checkAuthToken, defaultPath, logRequest } from './middleware/index.js';
import { deleteOld, getIp, getIps, insertIp } from './db.js';
import { getRequestIp, log } from './utils.js';

const app = express();
app.disable('x-powered-by');

const port = 80;
const day = 86400000;

const clean = async () => {
  try {
    await deleteOld();
    return 200;
  } catch (e) {
    return 400;
  }
};

setInterval(clean, day);
clean();

app.use(checkAuthToken);
app.use(logRequest);

app.get('/ip/get-all', async (req, res) => {
  try {
    const ips = await getIps();
    res.setHeader('content-type', 'application/json');
    res.send(ips);
  } catch (e) {
    log(req, (e as Error)?.message || 'Unable to /get-all');
    res.sendStatus(400);
  }
});

app.get('/ip/get', async (req, res) => {
  try {
    const ip = await getIp();
    res.setHeader('content-type', 'text/plain');
    res.send(ip);
  } catch (e) {
    log(req, (e as Error)?.message || 'Unable to /get');
    res.sendStatus(400);
  }
});

app.post('/ip/set', async (req, res) => {
  const ip = getRequestIp(req);
  try {
    await insertIp(ip);
    res.sendStatus(200);
  } catch (e) {
    log(req, (e as Error)?.message || 'Unable to /set');
    res.sendStatus(400);
  }
});

app.post('/ip/clean', async (_, res) => {
  const status = await clean();
  res.sendStatus(status);
});

app.use(defaultPath);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening at ${port}`));
