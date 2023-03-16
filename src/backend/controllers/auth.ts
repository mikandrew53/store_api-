import { compare, hash } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import { sign } from "jsonwebtoken";
import { User, UserDocument } from "../models/user/user";
import { StatusError } from "../types/StatusError";
import { JWT_SECRET } from "../util/envVariables";
import { handleError } from "../util/err";

export function putSignup(req: Request, res: Response, next: NextFunction) {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()){
        const error: StatusError = new StatusError("Validation failed.")
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const { email, name, password } = req.body;

    hash(password, 12)
    .then((hashedPassword: String) => {
        const user: UserDocument = new User({
            email: email,
            password: hashedPassword,
            name: name
        });
        return user.save();
    })
    .then((user: UserDocument) => {
        return res.status(201).json({ message: 'User created!', userId: user._id})
    })
    .catch((err: any) => {
        const statusErr: StatusError = handleError(err);
        next(statusErr);
    })
}

export function postLogin(req: Request, res: Response, next: NextFunction) {
    const { email, name } = req.body;
    const password: string = req.body.password;
    let loadedUser: UserDocument;
    User.findOne({ email: email })
    .then((user: UserDocument | null) => {
        if(!user) {
            const error: StatusError = new StatusError('Email or password not found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return compare(password, user.password);
    })
    .then((isEqual: boolean) => {
        if(!isEqual) {
            const error: StatusError = new StatusError('Email or password not found');
            error.statusCode = 401;
            throw error;
        }

        const token: string = sign({
            email: loadedUser.email, 
            userId: loadedUser._id.toString()
        }, JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err: any) => {
        const statusErr: StatusError = handleError(err);
        next(statusErr);
    })
}

export function getUserStatus(req: Request, res: Response, next: NextFunction) {
    User.findById(req.userId)
    .then((user: UserDocument | null) => {
        if (!user){
            const error: StatusError = new StatusError('User not found!');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ status: user.status })
    })
    .catch((err: any) => {
        const statusErr: StatusError = handleError(err);
        next(statusErr);
    });
}

export function patchUserStatus(req: Request, res: Response, next: NextFunction) {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()){
        const error: StatusError = new StatusError("Validation failed.")
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const newStatus = req.body.status;
    User.findById(req.userId)
    .then((user: UserDocument | null) => {
        if (!user){
            const error: StatusError = new StatusError('User not found!');
            error.statusCode = 404;
            throw error;
        }
        user.status = newStatus;
        return user.save();
    })
    .then((user: UserDocument) => res.status(200).json({ message: 'User updated' }))
    .catch((err: any) => {
        const statusErr: StatusError = handleError(err);
        next(statusErr);
    });
}