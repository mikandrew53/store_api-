import express from "express";
import {Router} from 'express-serve-static-core';
import { deletePost, getPost, getPosts, postPost, putPost } from "../controllers/feed";
import { body, ValidationChain } from 'express-validator';
import { isAuth } from "../middleware/is-auth";

export const feedRouter: Router = express.Router();

const createPostValidators: Array<ValidationChain> = [ 
    body('title')
        .trim().
        isLength({min: 5}), 
    body('content')
        .trim().
        isLength({min: 5})
]

feedRouter.get('/posts', isAuth, getPosts);
feedRouter.post('/post', isAuth, createPostValidators, postPost);
feedRouter.put('/post/:postId', isAuth, createPostValidators, putPost);
feedRouter.get('/post/:postId', isAuth, getPost);
feedRouter.delete('/post/:postId', isAuth, deletePost);