import { Product } from "./product";

export type Category = {
  _id: string;
  name: string;
  icon: string;
  products?: Product[];
};
