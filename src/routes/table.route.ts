import { Router } from "express";
import {
  createTable,
  deleteTable,
  getTables,
  updateTable,
} from "../controllers/table.controller";

const tableRouter = Router();

tableRouter.get("/", getTables);
tableRouter.post("/", createTable);
tableRouter.put("/:id", updateTable);
tableRouter.delete("/:id", deleteTable);

export default tableRouter;
