import express, { NextFunction, Request, Response } from "express";
import {Express} from 'express-serve-static-core';
import { feedRouter } from "./routes/feed";
import bodyParser from 'body-parser';
import { __imagesDir, __rootDir } from "./util/path";
import mongoose from 'mongoose';
import { logError } from "./util/err";
import multer, { diskStorage } from 'multer';
import { authRouter } from "./routes/auth";
import { StatusError } from "./types/StatusError";
import * as dotenv from "dotenv";
dotenv.config({ path: __rootDir+'/.env' });

const MONGODB_URI = `mongodb+srv://mikandrew:${process.env.DB_PASS}@cluster0.e3zsm1t.mongodb.net/messages`;

const app:Express  = express();

const fileStorage = diskStorage({
    destination: (req: Request, file: Express.Multer.File , cb:Function) => {
        cb(null, __imagesDir)
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
})

function fileFilter (req: Request, file: Express.Multer.File , cb: Function){
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
        cb(null, true);
    else 
        cb(null, false);
    
}

app.use(bodyParser.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter}).single('image')
);
app.use('/images', express.static(__imagesDir));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Origin", "*")
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/feed', feedRouter);
app.use('/auth', authRouter);

app.use((err: StatusError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    const status: number | undefined = err.statusCode ? err.statusCode : 500;
    const message: string = err.message;
    const data = err.data;
    res.status(status).json({ message: message, data: data });
});

mongoose.connect(MONGODB_URI)
.then(() => app.listen(8080))
.then(() => console.log('Connected!'))
.catch(logError);

