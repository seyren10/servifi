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
import upload from "../config/multer";

const productRouter = Router();

productRouter.use(authorize(ClientRole.CUSTOMER));
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.get("/category/:id", getProductsByCategoryId);

productRouter.use(authorize(ClientRole.USER));
productRouter.post("/", upload.single("image"), createProduct);
productRouter.put("/:id", upload.single("image"), updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
