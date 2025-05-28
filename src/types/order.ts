import mongoose, {
  Document,
  HydratedDocument,
  QueryWithHelpers,
} from "mongoose";

export type Order = Document & {
  table: mongoose.Types.ObjectId;
  products: {
    _id?: mongoose.Types.ObjectId; // Optional for new items
    product: mongoose.Types.ObjectId;
    quantity: number;
    total: number;
  }[];
  completed: boolean;
};

export type CustomQueryOptions = mongoose.QueryOptions & {
  includeCompleted?: boolean;
};
