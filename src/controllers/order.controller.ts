import { NextFunction, Request, Response } from "express";
import orderModel from "../models/order.model";
import { createOrderSchema } from "../validators/order.validator";
import { ValidationError } from "../utils/AppError";

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await orderModel
      .find()
      .populate(["products.id", "table"])
      .lean();

    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { success, data, error } = await createOrderSchema.safeParseAsync(
      req.body
    );
    if (!success) throw new ValidationError(error);

    const createdOrder = await orderModel.create(data);

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
}
