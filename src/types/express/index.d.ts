import { Table } from "../table";
import { User } from "../user";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      table?: Table;
      file?: File;
    }
  }
}
