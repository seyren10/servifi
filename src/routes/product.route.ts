import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductsByCategoryId,
  updateProduct,
} from "../controllers/product.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const productRouter = Router();

productRouter.use(authorize(ClientRole.CUSTOMER));
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.get("/category/:id", getProductsByCategoryId);

productRouter.use(authorize(ClientRole.USER));
productRouter.post("/", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
