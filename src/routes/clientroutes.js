import { Router } from 'express';
export const clientRouter = Router()

import controlRoutes from './client/control.js';
import dataRoutes from './client/data.js';


clientRouter.use('/control/', controlRoutes);
clientRouter.use('/data/', dataRoutes);


