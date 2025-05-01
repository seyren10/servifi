import mongoose, { SchemaDefinitionType } from "mongoose";

export type Product = Document & {
  name: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId;
  price: number;
  imageUrl: string;
  availability: boolean;
};
