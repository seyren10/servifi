import mongoose from "mongoose";
import { Service } from "../types/service";

const serviceSchema = new mongoose.Schema<Service>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const serviceModel = mongoose.model<Service>("Service", serviceSchema);

export default serviceModel;
