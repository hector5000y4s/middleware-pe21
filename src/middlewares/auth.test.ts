import { requireApiKey } from './auth'; // Ajusta la importación a tu código

describe('API Key Auth Middleware', () => {
  let req: any;
  let res: any;
  let next: any;

  // Ajusta esto al valor que uses en tu middleware real (aquí es 'secreto-demo')
  const CLAVE_VALIDA = 'secreto-demo'; 

  beforeEach(() => {
    req = {
      headers: {}
    };
    
    res = {
      // mockReturnThis() permite encadenar: res.status(401).json(...)
      status: jest.fn().mockReturnThis(), 
      json: jest.fn()
    };
    
    next = jest.fn();
    
    // Si usas variables de entorno en tu código real, configúrala para el test
    process.env.API_KEY = CLAVE_VALIDA; 
  });

  it('debe retornar estado 401 si el header x-api-key está ausente', () => {
    requireApiKey(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('debe retornar estado 401 si la clave es incorrecta', () => {
    req.headers['x-api-key'] = 'clave-tramposa-999';
    
    requireApiKey(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('debe invocar next() si la clave es válida', () => {
    req.headers['x-api-key'] = CLAVE_VALIDA;
    
    requireApiKey(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});