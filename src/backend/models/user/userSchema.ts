import { Schema, SchemaDefinition, SchemaOptions, Types } from "mongoose";

const schema: SchemaDefinition = {
  email: { type: String, required: true },
  password: { type: String,  required: true },
  name: { type: String, required: true },
  status: { type: String, default: 'I am new!' },
  posts: [{ type: Types.ObjectId, ref: 'Post' }]
}
const schemaOptions: SchemaOptions = { timestamps: true };

export const UserSchema: Schema = new Schema(schema, schemaOptions);

