import { Router } from "express";
import {
  createOngoingService,
  deleteOngoingService,
  getOngoingService,
  getOngoingServices,
  updateOngoingService,
} from "../controllers/ongoing-service.controller";
import { authorize } from "../middleware/auth";
import { ClientRole } from "../enums/roles";

const ongoingServiceRouter = Router();

ongoingServiceRouter.use(authorize(ClientRole.CUSTOMER));
ongoingServiceRouter.get("/", getOngoingServices);
ongoingServiceRouter.get("/:id", getOngoingService);
ongoingServiceRouter.post("/", createOngoingService);

ongoingServiceRouter.use(authorize(ClientRole.USER));
ongoingServiceRouter.put("/:id", updateOngoingService);
ongoingServiceRouter.delete("/:id", deleteOngoingService);

export default ongoingServiceRouter;
