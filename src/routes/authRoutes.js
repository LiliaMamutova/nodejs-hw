import {Router} from "express";
import {celebrate} from "celebrate";
import {loginUserSchema, registerUserSchema} from "../validations/authValidation.js";
import {loginUser, logoutUser, refreshUserSession, registerUser} from "../controllers/authController.js";

const userRouter = Router();

userRouter.post("/auth/register",
  celebrate(registerUserSchema,
    { abortEarly: false }),
  registerUser);

userRouter.post("/auth/login",
  celebrate(loginUserSchema,
    { abortEarly: false }),
  loginUser);

userRouter.post("/auth/logout", logoutUser);

userRouter.post("/auth/refresh", refreshUserSession);

export default userRouter;
