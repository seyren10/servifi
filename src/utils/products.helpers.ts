import { Request } from "express";
import jwt from "jsonwebtoken";
import { JwtAuthPayload } from "../types/jwt";

export const getRestrictedProductsFromJwt = (req: Request) => {
  let restrictedProducts: string[] | undefined = [];

  const auth = req.headers.authorization;
  if (auth) {
    const [bearer, token] = auth.split(" ");
    if (token) {
      const decoded = jwt.decode(token) as JwtAuthPayload;
      restrictedProducts = decoded.restrictedProductIds;
    }
  }

  return restrictedProducts;
};
