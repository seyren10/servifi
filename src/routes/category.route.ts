import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getCategory,
} from "../controllers/category.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const categoryRouter = Router();

categoryRouter.use(authorize(ClientRole.USER));

categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategory);
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
