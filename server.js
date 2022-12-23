const db = require('better-sqlite3')('./ip.db');
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const { pass } = require('./config.json');

const public = fs.readFileSync('./public.pem');

const app = express();

const port = 80;
const day = 86400000;

const start = db.prepare(`
  create table if not exists ip (
    id integer primary key,
    ip text not null
    check(
      length(ip) <= 45
    ),
    t timestamp default current_timestamp
  )
`);

start.run();

const insert = db.prepare(`
  insert into ip (
    ip
  ) values (
    ?
  )
`);

const get_latest = db.prepare(`
  select ip from ip
  order by t desc
  limit 50
`);

const delete_old = db.prepare(`
  delete from ip
  where t < date('now', '-1 days')
`);

const getIp = (req) => {
  try {
    return String(req.headers['cf-connecting-ip'] || req.connection.remoteAddress)
      .split(',')[0];
  } catch (e) {
    return 'Error';
  }
};

// Check that valid pass is present in headers
const isValidRequest = (req) => {
  const {
    authorization,
  } = req.headers;

  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      const sig = jwt.verify(authorization.slice('Bearer '.length), public);
      return sig.pass === pass;
    } catch (e) {
      log(req, `Invalid Request: ${e.message}`);
    }
  }
  return false;
};

const getDate = () => (new Date())
  .toLocaleString()
  .replace(',', '');

const log = (req, msg) => {
  console.log(`[${getDate()}] [${getIp(req)}] ${msg}`);
};

const clean = (
  req = {
    connection: {
      remoteAddress: 'scheduled',
    },
    headers: {},
  },
  res = {
    sendStatus: (_) => null,
  },
) => {
  log(req, '/clean');
  try {
    delete_old.run();
    res.sendStatus(200);
    return;
  } catch (e) {
  }
  res.sendStatus(400);
};

setInterval(clean, day);

clean();

app.use('*', (req, res, next) => {
  if (isValidRequest(req)) {
    next();
    return;
  }

  log(req, 'Invalid Request');
  res.sendStatus(403);
});

app.get('/ip/get-all', (req, res) => {
  log(req, '/get-all');
  const ips = get_latest.all().map(({ ip }) => ip);
  res.setHeader('content-type', 'application/json');
  res.send(ips);
});

app.get('/ip/get', (req, res) => {
  log(req, '/get');
  const latest = get_latest.get();
  let ip = null;
  if (latest) {
    ({ ip } = latest);
  }
  res.setHeader('content-type', 'text/plain');
  res.send(ip);
});

app.post('/ip/set', (req, res) => {
  log(req, '/set');
  const ip = getIp(req);
  try {
    insert.run(ip);
    res.sendStatus(200);
    return;
  } catch (e) {
  }
  res.sendStatus(400);
});

app.post('/ip/clean', clean);

// Default to 403
app.use('*', (req, res) => {
  log(req, 'Invalid Request');
  res.sendStatus(403);
});

app.listen(port, () => console.log(`Listening at ${port}`));
