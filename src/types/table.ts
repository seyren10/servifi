import { Document } from "mongoose";
import { TableStatus } from "../enums/table";

export type Table = Document & {
  number: number;
  capacity: number;
  status: TableStatus;
};
