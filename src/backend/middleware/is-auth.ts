import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { StatusError } from "../types/StatusError";
import { JWT_SECRET } from "../util/envVariables";
import { __rootDir } from "../util/path";

export function isAuth (req: Request, res: Response, next: NextFunction) {
    console.log("Checking if authenticated!");
    
    const authHeader = req.get('Authorization');
    if (!authHeader){
        const error: StatusError = new StatusError('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token: string = authHeader.split(' ')[1];
    let decodedToken: string | JwtPayload;

    try {
        decodedToken = verify(token, JWT_SECRET);
    } catch (err: any ) {
        const statusErr: StatusError = err;
        statusErr.statusCode = 500;
        throw statusErr;
    }

    if (!decodedToken) {
        const error: StatusError = new StatusError('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }

    if (typeof decodedToken !== 'string')
        req.userId = decodedToken.userId;

    next();
}