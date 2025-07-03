import { Router } from "express";
import {
  createPromo,
  deletePromo,
  getPromo,
  getPromos,
  updatePromo,
} from "../controllers/promo.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const promoRouter = Router();
promoRouter.use(authorize(ClientRole.USER));
promoRouter.get("/", getPromos);
promoRouter.get("/:id", getPromo);
promoRouter.post("/", createPromo);
promoRouter.put("/:id", updatePromo);
promoRouter.delete("/:id", deletePromo);

export default promoRouter;
