import mongoose, { Schema } from "mongoose";
import { OngoingService } from "../types/ongoing-service";

const ongoingServiceSchema = new Schema<OngoingService>(
  {
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
      index: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ongoingServiceModel = mongoose.model<OngoingService>(
  "OngoingService",
  ongoingServiceSchema
);

export default ongoingServiceModel;
