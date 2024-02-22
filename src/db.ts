import Database from 'better-sqlite3';
import { isGetLatest, isGetLatestArray } from './utils.js';

const db = new Database('./ip.db');
db.pragma('journal_mode = WAL');

db.prepare(
  `
  create table if not exists ip (
    id integer primary key,
    ip text not null
    check(
      length(ip) <= 45
    ),
    t timestamp default current_timestamp
  )
`,
).run();

const stmtDeleteOld = db.prepare(`
  delete from ip
  where t < date('now', '-1 days')
`);

const stmtGetLatest = db.prepare(`
  select ip from ip
  order by t desc
  limit 50
`);

const stmtInsert = db.prepare(`
  insert into ip (
    ip
  ) values (
    ?
  )
`);

const getIp = (): string => {
  const row = stmtGetLatest.get();
  if (isGetLatest(row)) {
    return row.ip;
  }
  return '';
};

const getIps = (): string[] => {
  const rows = stmtGetLatest.all();
  if (isGetLatestArray(rows)) {
    return rows.map(({ ip }) => ip);
  }
  return [];
};

const insertIp = (ip: string) => stmtInsert.run(ip);

const deleteOld = (): number => {
  try {
    stmtDeleteOld.run();
    return 200;
  } catch {
    return 400;
  }
};

export { deleteOld, getIp, getIps, insertIp };
