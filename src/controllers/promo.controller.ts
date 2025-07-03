import { NextFunction, Request, Response } from "express";
import promoModel from "../models/promo.model";
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
} from "../utils/AppError";
import {
  createPromoValidator,
  updatePromoValidator,
} from "../validators/promo.validator";
import productModel from "../models/product.model";

export async function getPromos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const promos = await promoModel.find().lean().exec();
    res.json(promos);
  } catch (error) {
    next(error);
  }
}

export async function getPromo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const promo = await promoModel
      .findById(id)
      .populate(["restrictedProducts"])
      .lean()
      .exec();

    if (!promo) throw new NotFoundError();
    res.json(promo);
  } catch (error) {
    next(error);
  }
}

export async function createPromo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { success, data, error } = createPromoValidator.safeParse(req.body);

    if (!success) throw new ValidationError(error);

    if (data.restrictedProducts && data.restrictedProducts.length) {
      const count = await productModel
        .countDocuments()
        .where("_id")
        .in(data.restrictedProducts)
        .lean()
        .exec();

      if (count !== data.restrictedProducts.length)
        throw new BadRequestError("Some of the products doesnt exist");
    }

    const promo = await promoModel.create(data);

    res.status(201).json(promo);
  } catch (error) {
    next(error);
  }
}
export async function updatePromo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: promoId } = req.params;
    const { success, data, error } = updatePromoValidator.safeParse(req.body);

    if (!success) throw new ValidationError(error);

    if (data.restrictedProducts && data.restrictedProducts.length) {
      const count = await productModel
        .countDocuments()
        .where("_id")
        .in(data.restrictedProducts)
        .lean()
        .exec();

      if (count !== data.restrictedProducts.length)
        throw new BadRequestError("Some of the products doesnt exist");
    }

    await promoModel.findByIdAndUpdate(promoId, data);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
export async function deletePromo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: promoId } = req.params;
    await promoModel.findByIdAndDelete(promoId);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
