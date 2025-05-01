import { Document } from "mongoose";

export type User = Document & {
  _id: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
};
