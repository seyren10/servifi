import { Router } from "express";
import {
  completeOrder,
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  getOrderSummary,
} from "../controllers/order.controller";

export const orderRouter = Router();

orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrder);
orderRouter.get("/table/:id/summary", getOrderSummary);
orderRouter.post("/", createOrder);
orderRouter.delete("/:id", deleteOrder);
orderRouter.patch("/:id/complete", completeOrder);
