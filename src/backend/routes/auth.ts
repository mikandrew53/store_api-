import express from "express";
import {Router} from 'express-serve-static-core';
import { body, ValidationChain } from 'express-validator'
import { getUserStatus, postLogin, patchUserStatus, putSignup } from "../controllers/auth";
import { isAuth } from "../middleware/is-auth";
import { User, UserDocument } from "../models/user/user";

export const authRouter: Router = express.Router();

const signupValidators: Array<ValidationChain> = [ 
    body('email')
        .isEmail().
        withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne( {email: value}).then((user: UserDocument | null) => {
                if (user)
                    return Promise.reject('Email address already exists');
            })
        })
        .normalizeEmail(),
    body('password')
    .trim()
    .isLength({ min: 5 }),
    body('name')
    .trim()
    .not()
    .isEmpty()
]

const statusValidators: Array<ValidationChain> = [ 
    body('status')
        .trim()
        .not()
        .isEmpty()
]


authRouter.put('/signup', signupValidators, putSignup);
authRouter.post('/login', postLogin);

authRouter.get('/status', isAuth, getUserStatus);
authRouter.patch('/status', statusValidators, isAuth, patchUserStatus);