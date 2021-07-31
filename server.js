const express = require('express');
const db = require('better-sqlite3')('./ip.db');
const { pass, user } = require('./config.json');

const app = express();

const port = 9006;
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
    return String(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
      .split(',')[0];
  } catch (e) {
    return 'Error';
  }
};

// Check that valid user / pass is present in headers
const isValidRequest = (req) => {
  const {
    pass: headerPass,
    user: headerUser,
  } = req.headers;

  if (headerPass && headerUser && headerPass === pass && headerUser === user) {
    return true;
  }
  return false;
};

const getDate = () => (new Date())
  .toLocaleString()
  .replace(',', '');

const log = (req, msg) => {
  console.log(`[${getDate()}] [${getIp(req)}] ${msg}`);
};

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
  const { ip } = get_latest.get();
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
app.post('/ip/clean', clean);

app.listen(port, () => console.log(`Listening at ${port}`));
