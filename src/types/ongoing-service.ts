import { Schema } from "mongoose";

export type OngoingService = {
  _id: string;
  table: Schema.Types.ObjectId;
  service: Schema.Types.ObjectId;
  completed: boolean;
};
