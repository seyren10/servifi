import { Document, Model } from "mongoose";

export type User = Document & {
  _id: string;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
};

export type UserMethods = {
  comparePassword: (password: string) => Promise<boolean>;
};
