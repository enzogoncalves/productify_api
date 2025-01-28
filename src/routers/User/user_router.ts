import express from 'express'
import { userController } from "./user_controller";

const userRoute = express.Router();

userRoute.get('/signin', userController.signIn)
userRoute.post('/create', userController.create)

export { userRoute }