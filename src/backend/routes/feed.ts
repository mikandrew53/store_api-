import express from "express";
import {Router} from 'express-serve-static-core';
import { deleteItem, getItem, getItems, postItem, putItem} from "../controllers/feed";
import { body, ValidationChain } from 'express-validator';
import { isAuth } from "../middleware/is-auth";

export const feedRouter: Router = express.Router();

const createPostValidators: Array<ValidationChain> = [ 
    body('title')
        .trim().
        isLength({min: 4}), 
    body('content')
        .trim().
        isLength({min: 5})
]

feedRouter.get('/items', isAuth, getItems);
feedRouter.post('/item', isAuth, createPostValidators, postItem);
feedRouter.put('/item/:itemId', isAuth, createPostValidators, putItem);
feedRouter.get('/item/:itemId', isAuth, getItem);
feedRouter.delete('/item/:itemId', isAuth, deleteItem);

