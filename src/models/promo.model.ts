import mongoose from "mongoose";
import { Promo } from "../types/promo";

const promoSchema = new mongoose.Schema<Promo>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
    description: String,
    restrictedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        index: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const promoModel = mongoose.model<Promo>("Promo", promoSchema);

export default promoModel;
