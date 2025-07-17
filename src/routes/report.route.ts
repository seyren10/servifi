import { Router } from "express";
import {
  downloadTransactionReport,
  getTransactionReport,
} from "../controllers/report.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

export const reportRouter = Router();

reportRouter.use(authorize(ClientRole.USER));
reportRouter.get("/", getTransactionReport);
reportRouter.get("/download-transaction", downloadTransactionReport);
