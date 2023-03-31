import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import { unlink } from "fs";
import { Item, ItemDocument } from "../models/item/item";
import { StatusError } from "../types/StatusError";
import { handleError, logError } from "../util/err";
import { __backendDir, __imagesDir } from "../util/path";
import path from "path";
import { User, UserDocument } from "../models/user/user";


export function getItems(req: Request, res: Response, next: NextFunction) {
    Item.find()
    .then((items: Array<ItemDocument>) => {
        res.status(200).json({ 
            cmessage: 'Ferched Items', items: items
        })
    })
    .catch((err: any) => {
        const statusErr: StatusError = handleError(err);
        next(statusErr);
    })
}

export function postItem(req: Request, res: Response, next: NextFunction) {
    const errors: Result<ValidationError> = validationResult(req);
    console.log(errors);
    console.log('PRICE: ' + req.body.price);
    
    if(!errors.isEmpty()) {
        const error: StatusError = new StatusError("Validation failed, entered data is incorrect.")
        error.statusCode = 422;
        throw error;
    }
    if (!req.file){
        const error: StatusError = new StatusError("No image provided");
        error.statusCode = 422;
        throw error;
    }
    console.log('here');
    
    const imagePath: string = req.file.path;
    const pathArr: Array<string> = imagePath.split(path.sep);
    const imageUrl = path.join('images', pathArr[pathArr.length-1]);
    let creator: UserDocument;
    const { title, content, price } = req.body;
    const item = new Item({
        title: title,
        content: content,
        creator: req.userId,
        imageUrl: imageUrl,
        price: price
    });
    item.save()
    .then((itemDoc: ItemDocument) => {
        return User.findById(req.userId)
    })
    .then((user: UserDocument | null) => {
        if (user){
            creator = user;
            user.items.push(item);
        }
        return user?.save();

    })
    .then((result) => {
        res.status(201).json({
            message: 'Item created successfully!',
            item: item,
            creator: { _id: creator._id, name: creator.name}
        })
    })
    .catch((err: any) => {
        const statusErr: StatusError = handleError(err);
        next(statusErr);
    });
}

export function getItem(req: Request, res: Response, next: NextFunction) {
    const itemId = req.params.itemId;
    Item.findById(itemId)
    .then((item: ItemDocument | null) => {
        if (!item) {
            const error: StatusError = new StatusError('Could not find Item');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Item fetched', item: item });
    })
    .catch((err: any) => {
        const statusErr: StatusError = handleError(err);
        next(statusErr);
    })

}

export function putItem(req: Request, res: Response, next: NextFunction) {
    const itemId = req.params.itemId;
    let imageUrl: string;
    if (req.file){
        const imagePath: string = req.file.path;
        const pathArr: Array<string> = imagePath.split(path.sep);
        imageUrl = path.join('images', pathArr[pathArr.length-1]);
    }else{
        imageUrl = req.body.image;
    }
    const { title, content, price } = req.body;

    if (!imageUrl){
        const error: StatusError = new StatusError('No file picked!');
        error.statusCode = 422;
        throw error;
    }

    Item.findById(itemId)
    .then((item: ItemDocument | null) => {
        if (!item){
            const error: StatusError = new StatusError("Could not find Item");
            error.statusCode = 404;
            throw error;
        }
        if (item.creator.toString() !== req.userId){
            const error: StatusError = new StatusError("Not Authorized!");
            error.statusCode = 403;
            throw error;
        }
        if (imageUrl !== item.imageUrl) {
            clearImage(item.imageUrl);
        }
        item.title = title;
        item.content = content;
        item.price = price;
        item.imageUrl = imageUrl;
        return item.save();
    }) 
    .then((item: ItemDocument) => res.status(200).json({ message: 'Item updated', item: item}))
    .catch((err: any) => {
        const statusErr: StatusError = handleError(err);
        next(statusErr);
    });
}

export function deleteItem(req: Request, res: Response, next: NextFunction) {
    const itemId = req.params.itemId;
    Item.findById(itemId)
    .then((item: ItemDocument | null) => {
        if(!item) {
            const error: StatusError = new StatusError('Could not find Item to delete');
            error.statusCode = 404;
            throw error;
        }
        if (item.creator.toString() !== req.userId){
            const error: StatusError = new StatusError("Not Authorized!");
            error.statusCode = 403;
            throw error;
        }
        clearImage(item.imageUrl);
        return item.deleteOne();
    })
    .then((result: any) => {
        return User.findById(req.userId)
    })
    .then((user: UserDocument | null) => {
        if (!user) {
            const error: StatusError = new StatusError('Could not find user');
            error.statusCode = 404;
            throw error;
        }
        user.items.pull(itemId);
        return user.save()
    })
    .then((user: UserDocument) => res.status(200).json({ message: 'Deleted Item'}))
    .catch((err) => {
        const statusErr: StatusError = handleError(err);
        next(statusErr);
    })

}

function clearImage(imagePath: string) {
    const filePath = path.join(__backendDir, imagePath);
    unlink(filePath, logError)
}