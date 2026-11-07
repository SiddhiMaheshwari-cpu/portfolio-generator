import {Router} from 'express';
import { listUsers,  getuser, } from '../controllers/user.controller';
export const userRouter = Router();
userRouter.get('/', listUsers);
userRouter.get('/:id', getuser);