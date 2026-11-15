// Local run: API + React (Vite middleware) on one port.
import path from 'node:path';
import { createServer } from 'vite';
import { APP_DIR, ENV_FILE, TEMPLATE_PATH } from './config.js';
import { createApp } from './server.js';

const app = createApp();
const vite = await createServer({
  configFile: path.join(APP_DIR, 'vite.config.js'),
  server: { middlewareMode: true },
  appType: 'spa',
  logLevel: 'warn',
});
app.use(vite.middlewares);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Config: ${ENV_FILE ? 'loaded .env (values hidden)' : 'no .env found, enter values in Settings'}`);
  console.log(`Template: ${TEMPLATE_PATH}`);
  console.log(`App running at http://localhost:${port}`);
});
