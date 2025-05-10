import mongoose, { CallbackError } from "mongoose";
import { Order } from "../types/order";
import productModel from "./product.model";

const orderSchema = new mongoose.Schema<Order>(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
      index: true,
    },
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          index: true,
        },
        quantity: {
          type: Number,
        },
        total: {
          type: Number,
        },
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", async function (next) {
  try {
    // Skip if products not modified
    if (!this.isModified("products")) return next();

    for (const item of this.products) {
      const product = await productModel.findById(item.id, { price: 1 }).lean();

      if (product) {
        item.total = item.quantity * product.price;
      }
    }
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
