import mongoose, { CallbackError, Model, QueryWithHelpers } from "mongoose";
import { Order, CustomQueryOptions } from "../types/order";
import productModel from "./product.model";
import { HydratedDocument } from "mongoose";
import { CallbackWithoutResultAndOptionalError } from "mongoose";

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
        product: {
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

/* MIDDLEWARES */
orderSchema.pre("find", autoExcludeCompleted);
orderSchema.pre("findOne", autoExcludeCompleted);
orderSchema.pre("countDocuments", autoExcludeCompleted);
orderSchema.pre("findOneAndUpdate", autoExcludeCompleted);

orderSchema.pre("save", async function (next) {
  try {
    // Skip if products not modified
    if (!this.isModified("products")) return next();

    for (const item of this.products) {
      const product = await productModel
        .findById(item.product, { price: 1 })
        .lean();

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

function autoExcludeCompleted(
  this: QueryWithHelpers<
    HydratedDocument<Order>[],
    HydratedDocument<Order>,
    {},
    Order
  >,
  next: CallbackWithoutResultAndOptionalError
) {
  const options = this.getOptions?.() as CustomQueryOptions | undefined;

  if (options?.includeCompleted) {
    return next();
  }

  const currentQuery = this.getQuery();

  if (typeof currentQuery.completed === "undefined") {
    this.where({ completed: false });
  }

  next();
}

export default orderModel;
