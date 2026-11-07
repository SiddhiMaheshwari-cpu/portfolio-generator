import {Router} from 'express';
import { listUsers, createUser } from '../controllers/user.controller';
export const userRouter = Router();
userRouter.get('/', listUsers);
userRouter.post('/', createUser);