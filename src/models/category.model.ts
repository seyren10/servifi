import mongoose from "mongoose";
import { Category } from "../types/category";

const categorySchema = new mongoose.Schema<Category>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
  }
);

/* virtuals */
categorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});

const categoryModel = mongoose.model<Category>("Category", categorySchema);

export default categoryModel;
