import { createToken, verifyToken } from './../../shared/token';
import database from "../../loaders/database";
import LoggerInstance from "../../loaders/logger";
import User, { LoginResponse } from "./model";
import * as bcrypt from "bcrypt";
import config from "../../config";
import { ObjectId } from "mongodb";

export async function createUser(user: User): Promise<boolean> {
    try{
        const saltData = bcrypt.genSaltSync(config.salt);
        user.password = bcrypt.hashSync(user.password, saltData)
        await (await database()).collection("users").insertOne(user)
        return true;
    }
    catch(e){
        LoggerInstance.error(e)
        return false;
    }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    try{
        const userData = await (await database()).collection("users").findOne({email: email});
        if(!userData){
            return {
                message: "User does not exist, Sign Up instead",
                status: 404,
            };
        }
        if(bcrypt.compareSync(password, userData.password)){
            return {
                message: "Login Successful",
                status: 200,
                token: createToken({id: userData._id.toString()})
            }
        }
        else {
            return {
                message: "Password does not match",
                status: 401
            };
        }
    }
    catch(e){
        LoggerInstance.error(e)
        return {
            message: `Something went wrong, [ERROR : ${e}]`,
            status: 500
        };
    }
}

export async function getProfile(token: string): Promise<User> {
    let id: string;
    try{
        id = verifyToken(token).id;
    }
    catch(e) {
        LoggerInstance.error(e)
        throw {
            message: "Unauthorized Access",
            status: 401
        }
    }
    const user = await (await database()).collection("users").findOne({_id: new ObjectId(id)})
    if(!user){
        throw {
            message: "User does not exist",
            status: 404
        }
    }
    return user;
}
