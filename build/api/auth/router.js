"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = __importDefault(require("../../loaders/logger"));
const controller_1 = require("./controller");
const schema_1 = require("./schema");
const authRouter = (0, express_1.Router)();
function handleLogin(req, res) {
    res.status(200).json({
        message: 'Success',
    });
}
async function handleSignUp(req, res) {
    try {
        const result = await (0, controller_1.createUser)(req.body);
        if (result) {
            res.status(201).json({
                message: 'Success',
            });
        }
        else {
            throw {
                status: 400,
                message: "User could not be created"
            };
        }
    }
    catch (e) {
        logger_1.default.error(e);
        res.status(e.status || 500).json({
            message: e.message || "Request Failed",
        });
    }
}
async function loginValidator(req, res, next) {
    try {
        req.body = await schema_1.loginSchema.validate(req.body, { stripUnknown: true });
        next();
    }
    catch (e) {
        logger_1.default.error(e);
        res.status(422).json({
            message: 'Validation Failed',
            error: e.errors.map(error => error),
        });
    }
}
async function signUpValidator(req, res, next) {
    try {
        req.body = await schema_1.signUpSchema.validate(req.body, { stripUnknown: true });
        next();
    }
    catch (e) {
        logger_1.default.error(e);
        res.status(422).json({
            message: 'Validation Failed',
            error: e.errors.map(error => error),
        });
    }
}
authRouter.post('/login', loginValidator, handleLogin);
authRouter.post('/signUp', signUpValidator, handleSignUp);
exports.default = authRouter;
//# sourceMappingURL=router.js.map