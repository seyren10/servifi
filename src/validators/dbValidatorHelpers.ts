/* validators for databases */

import { FilterQuery, Model } from "mongoose";
import productModel from "../models/product.model";
import Table from "../models/table.model";
import { TableStatus } from "../enums/table";

/**
 * Checks if a value does not exist in the specified field of a database model.
 *
 * @template T - The type of the model.
 * @param model - The database model to query.
 * @param field - The field of the model to check for the value.
 * @returns A function that takes a value (string or number) and returns a promise
 *          resolving to `true` if the value does not exist in the specified field,
 *          or `false` if it does exist.
 */
export function exists<T>(
  model: Model<T>,
  field: keyof T,
  negate: boolean = false
) {
  return async (value: string | number) => {
    const query: FilterQuery<T> = {
      [field]: value,
    } as FilterQuery<T>;

    const existing = await model.findOne(query);

    if (negate) return !existing;

    return Boolean(existing);
  };
}

/**
 * Checks if a product is available based on its ID.
 *
 * @param id - The unique identifier of the product to check.
 * @returns A promise that resolves to the availability status of the product.
 *          Returns `true` if the product is available, `false` if not, or `undefined` if the product does not exist.
 */
export async function productIsAvailable(id: string) {
  const product = await productModel.findById(id).lean();

  return product?.availability;
}

/**
 * Checks if a table is occupied based on its ID.
 *
 * @param id - The unique identifier of the table to check.
 * @returns A promise that resolves to `true` if the table is occupied/reserved, otherwise `false`.
 */
export async function tableIsOccupied(id: string) {
  const table = await Table.findById(id).lean();
  return table?.status !== TableStatus.AVAILABLE;
}
