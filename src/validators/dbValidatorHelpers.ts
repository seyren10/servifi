/* validators for databases */

import { FilterQuery, Model } from "mongoose";

/**
 * Search the database and will look for a row
 * @param model The mongo model you want to check
 * @param field the field of the model you want to look for
 * @returns true, indicating that it doesn't have a record on the db otherwise, it will return true
 */
export function unique<T>(model: Model<T>, field: keyof T) {
  return async (value: string | number) => {
    const query: FilterQuery<T> = {
      [field]: value,
    } as FilterQuery<T>;

    const existing = await model.findOne(query);

    return !existing;
  };
}
