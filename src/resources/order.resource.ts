import { FlattenMaps, Types } from "mongoose";
import { Order, OrderProduct } from "../types/order";

export const mergeCollectionResource = (res: FlattenMaps<Order>[]) => {
  const tableId = res.at(0)?.table;
  let grandTotal = 0;

  const productMap = new Map<Types.ObjectId, FlattenMaps<OrderProduct>>();

  for (const order of res) {
    for (const product of order.products) {
      const { quantity, total, product: id } = product;

      if (productMap.has(id)) {
        const existing = productMap.get(id)!;
        existing.quantity += quantity;
        existing.total += total;
      } else {
        productMap.set(id, { quantity, total, product: id });
      }

      grandTotal += total;
    }
  }
  const productArray = Array.from(productMap.values());

  return {
    table: tableId,
    products: productArray,
    total: grandTotal,
  };
};
