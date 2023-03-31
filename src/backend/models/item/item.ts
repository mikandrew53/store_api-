import { Types, Document, Model, model } from "mongoose";
import { ItemSchema } from "./itemSchema";
import { removeFromCart } from "./itemMethods";


export interface ItemAttributes {
    title: string;
    imageUrl: string,
    content: string,
    price: string,
    creator: Object
}

export interface ItemDocument extends Document {
    title: string;
    imageUrl: string,
    content: string,
    price: string,
    creator: Object
    // removeFromCart: (productId: string | Types.ObjectId) => Promise<UserDocument>;
}

// UserSchema.methods.removeFromCart = removeFromCart;

export const Item: Model<ItemDocument> = model<ItemDocument>('Item', ItemSchema);