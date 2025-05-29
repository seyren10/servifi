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

export async function getTables(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tables = await Table.find();

    res.json(tables);
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
    const { success, data, error } = await updateTableSchema.safeParseAsync(
      req.body
    );

    if (!success) throw new ValidationError(error);

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
    if (!config.jwtSecret) {
      logger.error(
        "JWT_SECRET is not set, please configure it in your .env file"
      );
      process.exit(1);
    }

    const { id } = req.params;
    const table = await Table.findById(id);

    if (table?.status !== TableStatus.AVAILABLE)
      throw new BadRequestError("Table already occupied");

    table.status = TableStatus.RESERVED;
    await table.save();

    const tableToken = jwt.sign(
      {
        type: ClientRole.CUSTOMER,
        id: table?._id,
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );

    const url = `${config.frontendUrl}?token=${tableToken}`;
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

export async function billOut(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.table) throw new NotFoundError("Table not found");

    const { table } = req;
    if (table.status !== TableStatus.OCCUPIED)
      throw new BadRequestError("Table should be occupied");

    const orders = await orderModel
      .find({ table: table._id, completed: true }, null, {
        includeCompleted: true,
      })
      .lean()
      .transform(mergeCollectionResource)
      .exec();

    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [_, token] = authHeader.split(" ");

      //throw an error when this session already billed out
      const existingSession = await receiptModel
        .findOne({ session: token })
        .lean();
      if (existingSession)
        throw new BadRequestError("Session already billed out");

      const receipt = await receiptModel.create({
        session: token,
        products: orders.products,
      });

      table.status = TableStatus.AVAILABLE;

      //delete orders
      await Promise.all([
        await orderModel.deleteMany({ table: table._id, completed: true }), //delete all the recorded orders
        await table.save(), //make the table available again
      ]);
    }

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
