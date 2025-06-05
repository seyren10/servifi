import { model, Schema } from "mongoose";
import { Table } from "../types/table";
import { TableStatus } from "../enums/table";

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

export default Table;
