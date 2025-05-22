import { NextFunction, Request, Response } from "express";
import orderModel from "../models/order.model";
import { createOrderSchema } from "../validators/order.validator";
import { NotFoundError, ValidationError } from "../utils/AppError";
import mongoose from "mongoose";

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await orderModel.find().lean();

    res.json(orders);
  } catch (error) {
    next(error);
  }
}
export async function getOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const order = await orderModel
      .findById(id)
      .populate(["products.product", "table"])
      .lean();

    if (!order) throw new NotFoundError("Resource not found");

    res.json(order);
  } catch (error) {
    next(error);
  }
}
export async function getOrderSummary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: tableId } = req.params;
    const orders = await orderModel
      .find(
        {
          table: tableId,
        },
        null,
        {
          includeCompleted: true,
        }
      )
      .populate(["products.product", "table"])
      .transform((orders) => {
        if (!orders || !orders.length) return;

        return orders.reduce<{
          products: mongoose.Types.ObjectId[];
          total: number;
        }>(
          (acc, cur) => {
            const currentProducts = cur.products.map((p) => p.product);
            const productsTotal = cur.products.reduce<number>((a, c) => {
              a += c.total;
              return a;
            }, 0);

            acc.products.push(...currentProducts);
            acc.total += productsTotal;
            return acc;
          },
          { products: [], total: 0 }
        );
      })
      .lean();

    if (!orders) throw new NotFoundError("Resource not found");

    console.log(orders);
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

export async function deleteOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await orderModel.findByIdAndDelete(id);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

export async function completeOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);
    if (order && !order.completed) {
      order.completed = true;
      await order.save();
    }

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
