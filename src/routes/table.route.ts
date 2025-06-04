import { Router } from "express";
import {
  billOut,
  createTable,
  deleteTable,
  generateSession,
  getSession,
  getTable,
  getTables,
  updateTable,
} from "../controllers/table.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const tableRouter = Router();

tableRouter.use(authorize(ClientRole.CUSTOMER));
tableRouter.get("/get-session", getSession);
tableRouter.post("/:id/bill-out", billOut);
tableRouter.use(authorize(ClientRole.USER));
tableRouter.get("/", getTables);
tableRouter.get("/:id", getTable);
tableRouter.post("/", createTable);
tableRouter.post("/:id/generate-session", generateSession);
tableRouter.put("/:id", updateTable);
tableRouter.delete("/:id", deleteTable);

export default tableRouter;
