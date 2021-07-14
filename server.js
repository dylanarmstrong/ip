const express = require('express');
const db = require('better-sqlite3')('./ip.db');

const app = express();

const port = 9006;

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

const getIp = (req) => {
  try {
    return String(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
      .split(',')[0];
  } catch (e) {
    return 'Error';
  }
};

const getDate = () => (new Date())
  .toLocaleString()
  .replace(',', '');

const log = (req, msg) => {
  console.log(`[${getDate()}] [${getIp(req)}] ${msg}`);
};

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
  } catch (e) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Listening at ${port}`));
