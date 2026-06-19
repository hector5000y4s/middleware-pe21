// Importamos con el nombre exacto que le pusiste
import { requestLogger } from './logger'; 

describe('Logger Middleware', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    // Inventamos una petición de prueba
    req = {
      method: 'GET',
      path: '/api/usuarios'
    };

    // Simulamos la respuesta (res)
    // Como tu código usa res.on('finish'), tenemos que crear una función falsa que haga eso
    res = {
      statusCode: 200,
      on: jest.fn((evento, callback) => {
        if (evento === 'finish') {
          callback(); // Hacemos que se ejecute el console.log para poder probarlo
        }
      })
    };

    next = jest.fn(); // Un espía para ver si llaman a next()
    
    // Apagamos el console.log de verdad para que no ensucie la terminal del test
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Limpiamos todo para la siguiente prueba
  });

  it('debe invocar next() al recibir una petición', () => {
    requestLogger(req, res, next);
    
    expect(next).toHaveBeenCalled(); // Verificamos que sí pasó al siguiente middleware
  });

  it('debe registrar el método, la ruta y el estado', () => {
    requestLogger(req, res, next);
    
    // Usamos expect.stringContaining porque el tiempo final (ms) va a ser diferente en cada prueba
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GET /api/usuarios -> 200'));
  });
});