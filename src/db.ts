import sql from 'sqlite3';

import type { GetLatest } from './types.js';

// eslint-disable-next-line import/no-named-as-default-member
const db = new sql.Database('./ip.db');

await new Promise<void>((resolve) =>
  db
    .prepare(
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
    )
    .run(resolve),
);

let isDeleteOldReady = false;
let isGetLatestReady = false;
let isInsertReady = false;

const stmtDeleteOld = db.prepare(`
  delete from ip
  where t < date('now', '-1 days')
`, () => isDeleteOldReady = true);

const stmtGetLatest = db.prepare(`
  select ip from ip
  order by t desc
  limit 50
`, () => isGetLatestReady = true);

const stmtInsert = db.prepare(`
  insert into ip (
    ip
  ) values (
    ?
  )
`, () => isInsertReady = true);

const getIp = async (): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!isGetLatestReady) {
      reject(new Error('get not ready'));
    }
    stmtGetLatest.get<GetLatest>((err, row) => {
      stmtGetLatest.reset((resetErr) => {
        if (err) {
          reject(err);
        }
        if (!row) {
          reject(new Error('Unable to /get'));
          // To clarify that row is defined after this
          return;
        }
        if (resetErr) {
          reject(resetErr);
        }
        resolve(row.ip);
      });
    });
  });

const getIps = async (): Promise<string[]> =>
  new Promise((resolve, reject) => {
    if (!isGetLatestReady) {
      reject(new Error('get not ready'));
    }
    stmtGetLatest.all<GetLatest>((err, rows) => {
      stmtGetLatest.reset((resetErr) => {
        if (err) {
          reject(err);
        }
        if (resetErr) {
          reject(resetErr);
        }
        resolve(rows.map(({ ip }) => ip));
      });
    });
  });

const insertIp = async (ip: string): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (!isInsertReady) {
      reject(new Error('insert not ready'));
    }
    stmtInsert.run(ip, (err) => {
      stmtInsert.reset((resetErr) => {
        if (err) {
          reject(err);
        }
        if (resetErr) {
          reject(resetErr);
        }
        resolve();
      });
    });
  });

const deleteOld = async (): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (!isDeleteOldReady) {
      reject(new Error('delete not ready'));
    }
    stmtDeleteOld.run((err) => {
      stmtDeleteOld.reset((resetErr) => {
        if (err) {
          reject(err);
        }
        if (resetErr) {
          reject(resetErr);
        }
        resolve();
      });
    });
  });

const clean = async (): Promise<number> => {
  try {
    await deleteOld();
    return 200;
  } catch {
    return 400;
  }
};

export { clean, getIp, getIps, insertIp };
