import { Router, Request, Response, NextFunction } from 'express';
import LoggerInstance from '../../loaders/logger';
import { createUser } from './controller';
import { loginSchema, signUpSchema } from './schema';
const authRouter = Router();

function handleLogin(req: Request, res: Response) {
  res.status(200).json({
    message: 'Success',
  });
}
async function handleSignUp(req: Request, res: Response) {
    try{
        const result = await createUser(req.body);
        if(result){
            res.status(201).json({
                message: 'Success',
              });
        }
        else {
            throw {
                status: 400,
                message: "User could not be created"
            }
        }
    }
    catch(e){
        LoggerInstance.error(e)
        res.status(e.status || 500).json({
            message: e.message || "Request Failed",
        })
    }
}
async function loginValidator(req: Request, res: Response, next: NextFunction) {
  try {
    req.body = await loginSchema.validate(req.body, { stripUnknown: true });
    next();
  } catch (e) {
    LoggerInstance.error(e);
    res.status(422).json({
      message: 'Validation Failed',
      error: e.errors.map(error => error),
    });
  }
}
async function signUpValidator(req: Request, res: Response, next: NextFunction) {
  try {
    req.body = await signUpSchema.validate(req.body, { stripUnknown: true });
    next();
  } catch (e) {
    LoggerInstance.error(e);
    res.status(422).json({
      message: 'Validation Failed',
      error: e.errors.map(error => error),
    });
  }
}
authRouter.post('/login', loginValidator, handleLogin);
authRouter.post('/signUp', signUpValidator, handleSignUp);
export default authRouter;
