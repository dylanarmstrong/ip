import type { Request } from 'express';

import type { GetLatest } from './types.js';

const getRequestIp = (req: Request) => {
  try {
    return String(
      req.headers['cf-connecting-ip'] || req.socket.remoteAddress,
    ).split(',')[0];
  } catch {
    return 'Error';
  }
};

const getDate = () => new Date().toLocaleString().replace(',', '');

const isGetLatest = (row: unknown): row is GetLatest =>
  typeof row !== 'undefined' &&
  Object.hasOwnProperty.call(row, 'ip') &&
  typeof (row as GetLatest)['ip'] === 'string';

const isGetLatestArray = (rows: unknown[]): rows is GetLatest[] =>
  rows.every(
    (row) =>
      Object.hasOwnProperty.call(row, 'ip') &&
      typeof (row as GetLatest)['ip'] === 'string',
  );

const log = (req: Request, msg: string) => {
  // eslint-disable-next-line no-console
  console.log(`[${getDate()}] [${getRequestIp(req)}] ${msg}`);
};

export { getRequestIp, isGetLatest, isGetLatestArray, log };
