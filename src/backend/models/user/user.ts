import { Types, Document, Model, model } from "mongoose";
import { PostDocument } from "../item/post";
import { removeCart } from "./userMethods";
import { UserSchema } from "./userSchema";


export interface UserAttributes {
    email: string
    password: string
    name: string
    status: string
    posts: Array<Types.ObjectId>
}

export interface UserDocument extends Document {
    email: string,
    password: string,
    name: string,
    status: string,
    posts: Types.Array<Types.ObjectId>
    // removeCart: (productId: string | Types.ObjectId) => Promise<UserDocument>;
}

// UserSchema.methods.removeCart = removeCart;

export const User: Model<UserDocument> = model<UserDocument>('User', UserSchema);