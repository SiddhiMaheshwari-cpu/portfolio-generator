import {Router} from 'express';
import { listUsers,  getuser, } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';
export const userRouter = Router();
userRouter.use(requireAuth);
userRouter.get('/', listUsers);
userRouter.get('/:id', getuser);