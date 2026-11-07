import {Router} from 'express';
import { listUsers, createUser, getuser, } from '../controllers/user.controller';
export const userRouter = Router();
userRouter.get('/', listUsers);
userRouter.post('/', createUser);
userRouter.get('/:id', getuser);