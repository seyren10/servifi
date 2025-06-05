import Table from "../models/table.model";
import jwt from "jsonwebtoken";
import config from "../config/dotenv";
import logger from "../config/winston";

import { NextFunction, Request, Response } from "express";
import {
  createTableSchema,
  updateTableSchema,
} from "../validators/table.validator";
import {
  AccessTokenError,
  BadRequestError,
  NotFoundError,
  ValidationError,
} from "../utils/AppError";
import { ClientRole } from "../enums/roles";
import { TableStatus } from "../enums/table";
import orderModel from "../models/order.model";
import { mergeCollectionResource } from "../resources/order.resource";
import receiptModel from "../models/receipt.model";
import { ZodError } from "zod";
import { OrderProduct } from "../types/order";
import { getIO } from "../config/socket";

export async function getTables(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tables = await Table.find().sort({ updatedAt: -1 });

    res.json(tables);
  } catch (error) {
    next(error);
  }
}

export async function getTable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const table = await Table.findById(id).lean().exec();

    res.json(table);
  } catch (error) {
    next(error);
  }
}

export async function createTable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { success, data, error } = await createTableSchema.safeParseAsync(
      req.body
    );
    if (!success) throw new ValidationError(error);

    const newTable = await Table.create({ ...data });

    res.status(201).json(newTable);
  } catch (error) {
    next(error);
  }
}

export async function updateTable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { success, data, error } = updateTableSchema.safeParse(req.body);

    if (!success) throw new ValidationError(error);

    const { number } = data;
    const existingTable = await Table.findOne({ number }).lean();

    if (existingTable && existingTable._id.toString() !== id)
      throw new ValidationError(
        new ZodError([
          {
            path: ["number"],
            message: "Table already exists",
            code: "custom",
          },
        ])
      );

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );
    res.status(200).json(updatedTable);
  } catch (error) {
    next(error);
  }
}

export async function deleteTable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await Table.findByIdAndDelete(id);
    await orderModel.deleteMany({ table: id });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

export async function generateSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);

    if (table?.status !== TableStatus.AVAILABLE)
      throw new BadRequestError("Table already occupied");

    const tableToken = jwt.sign(
      {
        type: ClientRole.CUSTOMER,
        id: table?._id,
      },
      config.jwtSecret!,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );

    const url = `${config.frontendUrl}?token=${tableToken}`;

    table.status = TableStatus.RESERVED;
    table.activeSession = tableToken;
    await table.save();

    res.json({
      url,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.table) {
      throw new AccessTokenError();
    }

    res.send(req.table);
  } catch (error) {
    next(error);
  }
}

export async function requestBillOut(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.table) throw new NotFoundError("Table not found");

    const { table } = req;
    if (table.status !== TableStatus.OCCUPIED)
      throw new BadRequestError("Table should be occupied");

    table.status = TableStatus.BILLOUT;
    await table.save();

    const io = getIO();

    io.emit("table-update", {
      message: `Table # ${table.number} has requested the bill.`,
    });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

/**
 * Bill out for auth users with controls
 * @param req
 * @param res
 * @param next
 */
export async function billOut(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { norecord } = req.query as {
      /** No products and total will be included on receipt */
      norecord?: string;
    };

    const table = await Table.findById(id).exec();
    if (!table) throw new NotFoundError();

    const orders = await orderModel
      .find({ table: table._id, completed: true }, null, {
        includeCompleted: true,
      })
      .lean()
      .transform(mergeCollectionResource)
      .exec();

    if (!table.activeSession)
      throw new NotFoundError("No active session found");

    const receipt = new receiptModel();
    receipt.session = table.activeSession;

    if (!norecord)
      receipt.products = orders.products.map((p: OrderProduct) => {
        return {
          productId: p.product,
          quantity: p.quantity,
          total: p.total,
          _id: p._id,
        };
      });

    await receipt.save();

    await orderModel.deleteMany(
      { table: table._id },
      {
        includeCompleted: true,
      }
    ); //delete all the recorded orders

    table.status = TableStatus.AVAILABLE;
    table.activeSession = undefined;
    await table.save(); //make the table available again

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
