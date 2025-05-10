import { Router } from "express";
import {
  createTable,
  deleteTable,
  generateSession,
  getTables,
  updateTable,
} from "../controllers/table.controller";

const tableRouter = Router();

tableRouter.get("/", getTables);
tableRouter.post("/", createTable);
tableRouter.put("/:id", updateTable);
tableRouter.delete("/:id", deleteTable);
tableRouter.post("/:id/generate-session", generateSession);

export default tableRouter;
