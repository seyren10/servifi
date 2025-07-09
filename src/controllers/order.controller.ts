import { NextFunction, Request, Response } from "express";
import orderModel from "../models/order.model";
import { createOrderSchema } from "../validators/order.validator";
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
} from "../utils/AppError";
import { mergeCollectionResource } from "../resources/order.resource";
import { getIO } from "../config/socket";
import { getRestrictedProductsFromJwt } from "../utils/products.helpers";
import productModel from "../models/product.model";

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { populate } = req.query;
    const orderQuery = orderModel.find();

    if (populate) {
      const populateString = populate.toString().replace(",", " ");
      orderQuery.populate({
        path: populateString,
        strictPopulate: false,
      });
    }

    const orders = await orderQuery.exec();

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
          completed: true,
        },
        null,
        {
          includeCompleted: true,
        }
      )
      .lean()
      .transform(mergeCollectionResource)
      .populate("products.product", "name")
      .exec();

    if (!orders) throw new NotFoundError("Resource not found");

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

    const productIds = data.products.map((p) => p.product);
    const products = await productModel
      .where("_id")
      .in(productIds)
      .lean()
      .exec();
    const restrictedProducts = getRestrictedProductsFromJwt(req);
    const productsAreAvailable = products.every(
      (p) => p.availability && !restrictedProducts?.includes(p._id.toString())
    );
    if (!productsAreAvailable)
      throw new BadRequestError("Some of the products are not available");

    const createdOrder = await orderModel.create(data);

    const io = getIO();

    io.emit("order-created", {
      message: "New order created",
    });

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

      const io = getIO();

      io.to(order.table.toString()).emit("order-completed", {
        message: "Order completed",
      });
    }

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
