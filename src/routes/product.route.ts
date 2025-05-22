import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductsByCategoryId,
  updateProduct,
} from "../controllers/product.controller";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.get("/category/:id", getProductsByCategoryId);
productRouter.post("/", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
