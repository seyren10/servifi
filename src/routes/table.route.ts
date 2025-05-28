import { Router } from "express";
import {
  billOut,
  createTable,
  deleteTable,
  generateSession,
  getSession,
  getTables,
  updateTable,
} from "../controllers/table.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const tableRouter = Router();

tableRouter.get("/", getTables);
tableRouter.get("/get-session", authorize(ClientRole.CUSTOMER), getSession);
tableRouter.post("/", createTable);
tableRouter.post("/:id/generate-session", generateSession);
tableRouter.post("/:id/bill-out", authorize(ClientRole.CUSTOMER), billOut);
tableRouter.put("/:id", updateTable);
tableRouter.delete("/:id", deleteTable);

export default tableRouter;
