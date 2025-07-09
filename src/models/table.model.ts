import { CallbackError, model, Schema } from "mongoose";
import { Table } from "../types/table";
import { TableStatus } from "../enums/table";
import orderModel from "./order.model";

const tableSchema = new Schema<Table>(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(TableStatus),
      default: TableStatus.AVAILABLE,
    },
    activeSession: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Table = model<Table>("Table", tableSchema);

tableSchema.post("deleteOne", async function (doc, next) {
  try {
    await orderModel.deleteMany({ table: doc._id });
  } catch (err) {
    next(err as CallbackError);
  }
});
export default Table;
