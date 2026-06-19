import { type Request, type Response, Router } from 'express';

// public router = new Router();
const router = Router();

//Post: estudianteId, materias (Arreglo), periodoId - registrar matricula
router.post('/', (req: Request, res: Response) => {
    // const body = req.body;
    const {estudianteId, materias, periodoId} = req.body;

    if (!estudianteId || !materias || !periodoId) {
        console.error('Faltan datos requeridos');
        return res.status(400).json(
            {  
                error: 'Faltan datos requeridos: estudianteId, materias, periodoId'
            }
        )    
    }

    return res.status(201).json({
        version: 'v1',
        message:{
            estudianteId,materias,periodoId
        }
    })

});

export default router;