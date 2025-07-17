import { Router } from "express";
import {
  createService,
  deleteService,
  getService,
  getServices,
  updateService,
} from "../controllers/service.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const serviceRouter = Router();

serviceRouter.use(authorize(ClientRole.CUSTOMER));
serviceRouter.get("/", getServices);
serviceRouter.get("/:id", getService);

serviceRouter.use(authorize(ClientRole.USER));
serviceRouter.post("/", createService);
serviceRouter.put("/:id", updateService);
serviceRouter.delete("/:id", deleteService);

export default serviceRouter;
