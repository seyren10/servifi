import { Router } from "express";
import {
  downloadTransactionReport,
  getTransactionReport,
} from "../controllers/report.controller";

export const reportRouter = Router();

reportRouter.get("/", getTransactionReport);
reportRouter.get("/download-transaction", downloadTransactionReport);
