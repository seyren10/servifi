import mongoose, { Schema } from "mongoose";
import { Product } from "../types/product";

const productSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg))$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model<Product>("Product", productSchema);

export default productModel;
