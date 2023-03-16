import { __rootDir } from "./path";
import * as dotenv from "dotenv";
dotenv.config({ path: __rootDir+'/.env' });

export const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_NAME = process.env.DB_NAME
export const DB_PASS = process.env.DB_PASS
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
export const JWT_SECRET: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'secret';








