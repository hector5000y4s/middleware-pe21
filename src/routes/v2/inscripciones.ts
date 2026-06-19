import { type Request, type Response, Router } from 'express';

// public router = new Router();
const router = Router();

const METODO_PAGO = ['efectivo', 'transferencia', 'Debito', 'Credito']
//Post: estudianteId, materias (Arreglo), periodoId, metodo de pago - registrar matricula
router.post('/', (req: Request, res: Response) => {
    // const body = req.body;
    const {estudianteId, materias, periodoId, metodo_pago} = req.body;

    if (!estudianteId || !materias || !periodoId || !metodo_pago) {
        console.error('Faltan datos requeridos');
        res.status(400).json(
            {  
                error: 'Faltan datos requeridos: estudianteId, materias, periodoId'
            }
        )    
    }

    if (!METODO_PAGO.includes(metodo_pago)) {
        console.error('El metodo de pago insertado no es valido');
       return res.status(400).json(
            {  
                error: 'El metodo de pago insertadp deber ser efectivo, transferencia, Debito o Credito'
            }
        )    
    }

    res.status(201).json({
        version: 'v2',
        message:{
            estudianteId,materias,periodoId,metodo_pago
        }
    })

});

export default router;