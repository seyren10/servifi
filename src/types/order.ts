import mongoose, {
  Document,
  HydratedDocument,
  QueryWithHelpers,
} from "mongoose";

export type Order = Document & {
  table: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    total: number;
  }[];
  completed: boolean;
};

export type CustomQueryOptions = mongoose.QueryOptions & {
  includeCompleted?: boolean;
};
