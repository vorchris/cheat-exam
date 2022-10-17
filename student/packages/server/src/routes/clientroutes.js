import { Router } from 'express';
export const clientRouter = Router()

import dataRoutes from './client/data.js';


clientRouter.use('/data/', dataRoutes);


