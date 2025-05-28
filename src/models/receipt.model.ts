import mongoose, { Schema } from "mongoose";
import { Receipt } from "../types/receipt";

const receiptSchema = new Schema<Receipt>({
  session: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      total: Number,
    },
  ],
  total: Number,
});

const receiptModel = mongoose.model("Receipt", receiptSchema);

export default receiptModel;
