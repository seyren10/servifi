import mongoose, { CallbackError, Schema } from "mongoose";
import { Receipt } from "../types/receipt";

const receiptSchema = new Schema<Receipt>(
  {
    session: {
      type: String,
      required: true,
      index: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          index: true,
        },
        quantity: {
          type: Number,
        },
        total: Number,
      },
    ],
    total: Number,
  },
  {
    timestamps: true,
  }
);

receiptSchema.pre("save", async function (next) {
  try {
    // Skip if products not modified
    if (!this.isModified("products")) return next();

    const total = this.products.reduce<number>(
      (acc, cur) => (acc += cur.total),
      0
    );
    this.total = total;
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});
const receiptModel = mongoose.model("Receipt", receiptSchema);

export default receiptModel;
