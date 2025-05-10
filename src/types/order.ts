import mongoose, { Document } from "mongoose";

export type Order = Document & {
  table: mongoose.Types.ObjectId;
  products: {
    id: mongoose.Types.ObjectId;
    quantity: number;
    total: number;
  }[];
  completed: boolean;
};
