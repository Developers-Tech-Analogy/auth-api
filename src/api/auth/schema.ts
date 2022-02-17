import * as yup from 'yup';
import { emails } from './controller'
const login = {
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
};
const signUp = {
  name: yup.string().required(),
  email: yup.string().email().required().notOneOf(emails,'Email address already taken!'),
  password: yup.string().min(6).required(),
};

export const loginSchema = new yup.ObjectSchema(login);
export const signUpSchema = new yup.ObjectSchema(signUp);
