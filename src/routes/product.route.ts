import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const productRouter = Router();

productRouter.get("/", authorize(), getProducts);
productRouter.get("/:id", authorize(), getProduct);
productRouter.post("/", authorize(ClientRole.USER), createProduct);
productRouter.put("/:id", authorize(ClientRole.USER), updateProduct);
productRouter.delete("/:id", authorize(ClientRole.USER), deleteProduct);

export default productRouter;
