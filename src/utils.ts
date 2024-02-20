import type { Request } from 'express';

const getRequestIp = (req: Request) => {
  try {
    return String(
      req.headers['cf-connecting-ip'] || req.socket.remoteAddress,
    ).split(',')[0];
  } catch (e) {
    return 'Error';
  }
};

const getDate = () => new Date().toLocaleString().replace(',', '');

const log = (req: Request, msg: string) => {
  // eslint-disable-next-line no-console
  console.log(`[${getDate()}] [${getRequestIp(req)}] ${msg}`);
};

export { getRequestIp, log };
