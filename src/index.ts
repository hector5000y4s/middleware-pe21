import express, { type Request, type Response, type NextFunction } from 'express';
import { requestLogger } from './middlewares/logger.js';
import { requireJwt } from './middlewares/auth.js';         // <-- 1. Importamos requireJwt
import { rateLimiter } from './middlewares/rateLimiter.js'; // <-- 2. Importamos el limitador

// importar las rutas v1, v2 para inscripciones
import Inscripcionesv1 from './routes/v1/inscripciones.js';
import InscripcionesV2 from './routes/v2/inscripciones.js';

const app = express();

app.use(express.json());      // 1. Parseo del cuerpo

// Debug: loguear requests entrantes (actualizado para ver el JWT en vez de la API Key)
app.use((req, _res, next) => {
  // eslint-disable-next-line no-console
  console.log('INCOMING', req.method, req.url, 'Authorization=', req.headers['authorization']);
  next();
});

app.use(requestLogger);       // 2. Logger
app.use(requireJwt);          // 3. Autenticación JWT (Reemplaza a requireApiKey)
app.use(rateLimiter);         // 4. Rate Limiting (Nuevo middleware del lab)

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// Nota: Cambié a minúsculas '/v1/inscripciones' para que coincida exactamente con las URLs de Postman de la guía
app.use('/v1/inscripciones', Inscripcionesv1);
app.use('/v2/inscripciones', InscripcionesV2);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Loguear error para depuración
  // eslint-disable-next-line no-console
  console.error('ERROR HANDLER:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));