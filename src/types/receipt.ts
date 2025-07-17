import mongoose from "mongoose";

export type Receipt = Document & {
  _id?: string;
  session: string;
  products: {
    _id?: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    quantity: number;
    total: number;
  }[];
  total: number;
  updatedAt?: string;
  createdAt?: string;
};
