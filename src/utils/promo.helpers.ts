import productModel from "../models/product.model";

export const validPromos = async (restrictedProducts: string[]) => {
  const count = await productModel
    .countDocuments()
    .where("_id")
    .in(restrictedProducts)
    .lean()
    .exec();

  return count === restrictedProducts.length;
};
