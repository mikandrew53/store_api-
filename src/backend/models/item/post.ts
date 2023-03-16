import { Types, Document, Model, model } from "mongoose";
import { PostSchema } from "./postSchema";
import { removeFromCart } from "./postMethods";


export interface PostAttributes {
    title: string;
    imageUrl: string,
    content: string,
    creator: Object
}

export interface PostDocument extends Document {
    title: string;
    imageUrl: string,
    content: string,
    creator: Object
    // removeFromCart: (productId: string | Types.ObjectId) => Promise<UserDocument>;
}

// UserSchema.methods.removeFromCart = removeFromCart;

export const Post: Model<PostDocument> = model<PostDocument>('Post', PostSchema);