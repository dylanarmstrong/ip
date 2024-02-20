import express from 'express';

import { checkAuthToken, defaultPath, logRequest } from './middleware/index.js';
import { clean } from './db.js';
import { router } from './router.js';

const app = express();
app.disable('x-powered-by');

const baseUrl = '/ip';
const port = 80;
const day = 86400000;

setInterval(clean, day);
clean();

app.use(checkAuthToken);
app.use(logRequest);
app.use(baseUrl, router);

app.use(defaultPath);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening at ${port}`));
