import { Router } from 'express';
export const serverRouter = Router()

import controlRoutes from './server/control.js';
import dataRoutes from './server/data.js';


serverRouter.use('/control/', controlRoutes);
serverRouter.use('/data/', dataRoutes);


