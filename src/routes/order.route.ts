import { Router } from "express";
import {
  completeOrder,
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  getOrderSummary,
} from "../controllers/order.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

export const orderRouter = Router();

orderRouter.use(authorize(ClientRole.CUSTOMER));
orderRouter.get("/table/:id/summary", getOrderSummary);
orderRouter.post("/", createOrder);

orderRouter.use(authorize(ClientRole.USER));
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrder);
orderRouter.delete("/:id", deleteOrder);
orderRouter.patch("/:id/complete", completeOrder);
