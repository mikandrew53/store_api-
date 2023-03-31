import { Schema, SchemaDefinition, SchemaOptions, Types } from "mongoose";

const schema: SchemaDefinition = {
  title: { type: String, required: true },
  imageUrl: { type: String,  required: true },
  content: { type: String, required: true },
  price: { type: String, required: true },
  creator: { type: Types.ObjectId, ref: 'User', required: true }
}
const schemaOptions: SchemaOptions = { timestamps: true };

export const ItemSchema: Schema = new Schema(schema, schemaOptions);

