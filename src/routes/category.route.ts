import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getCategory,
  categoryProductsCount,
  moveProductsCategory,
} from "../controllers/category.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const categoryRouter = Router();

categoryRouter.use(authorize(ClientRole.CUSTOMER));
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategory);

categoryRouter.use(authorize(ClientRole.USER));

categoryRouter.get("/:id/products-count", categoryProductsCount);
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.put("/from/:from/to/:to", moveProductsCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
