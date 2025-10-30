import express from 'express';
import { loginUser, registerUser, changePassword } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/change-password", authMiddleware, changePassword);

export default userRouter;