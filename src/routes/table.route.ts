import { Router } from "express";
import {
  billOut,
  createTable,
  deleteTable,
  generateSession,
  getSession,
  getTable,
  getTables,
  requestBillOut,
  updateTable,
} from "../controllers/table.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const tableRouter = Router();

tableRouter.use(authorize(ClientRole.CUSTOMER));
tableRouter.get("/get-session", getSession);
tableRouter.patch("/:id/request-bill-out", requestBillOut);

tableRouter.use(authorize(ClientRole.USER));
tableRouter.get("/", getTables);
tableRouter.get("/:id", getTable);
tableRouter.post("/", createTable);
tableRouter.post("/:id/promo/:promoId/generate-session", generateSession);
tableRouter.put("/:id", updateTable);
tableRouter.delete("/:id", deleteTable);
tableRouter.delete("/:id/bill-out", billOut);

export default tableRouter;
