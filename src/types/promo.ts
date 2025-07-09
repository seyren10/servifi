import mongoose from "mongoose";

export type Promo = Document & {
  _id: string;
  title: string;
  description?: string;
  restrictedProducts?: mongoose.Schema.Types.ObjectId[];
};
