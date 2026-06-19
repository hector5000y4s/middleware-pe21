import express, { type Request, type Response, type NextFunction } from 'express';
import { requestLogger } from './middlewares/logger.js';
import { requireApiKey } from './middlewares/auth.js';

//importar las rutas v1, v2 para inscripciones

import Inscripcionesv1 from './routes/v1/inscripciones.js';
import InscripcionesV2 from './routes/v2/inscripciones.js';

const app = express();
app.use((req, res, next) => {
console.log('INCOMING:', req.method, req.url, req.headers['x-api-key']);
next();
});

app.use(express.json());      // 1. Parseo del cuerpo
// Debug: loguear requests entrantes y header x-api-key (temporal)
app.use((req, _res, next) => {
  // eslint-disable-next-line no-console
  console.log('INCOMING', req.method, req.url, 'x-api-key=', req.headers['x-api-key']);
  next();
});
app.use(requestLogger);       // 2. Logger
app.use(requireApiKey);       // 3. Autenticación

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

app.use('/v1/Inscripciones', Inscripcionesv1);
app.use('/v2/Inscripciones', InscripcionesV2);
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Loguear error para depuración
  // eslint-disable-next-line no-console
  console.error('ERROR HANDLER:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));