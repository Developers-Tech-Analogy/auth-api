import database from "../../loaders/database";
import LoggerInstance from "../../loaders/logger";
import User from "./model";
import * as bcrypt from "bcrypt";
import config from "../../config";

export const emails = await (await database()).collection("users").find().map(e=>e.email);

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
