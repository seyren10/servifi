import morgan from "morgan";
import express, { Request, Response } from "express";
import cors from "cors";

import config from "./config/dotenv";
import { errorHander } from "./middleware/errorHandler";
import categoryRouter from "./routes/category.route";
import productRouter from "./routes/product.route";
import tableRouter from "./routes/table.route";
import { orderRouter } from "./routes/order.route";
import authRouter from "./routes/auth.route";

/* workers */
import "./workers/imageDelete.worker";
import "./workers/imageUpload.worker";
import promoRouter from "./routes/promo.route";
import serviceRouter from "./routes/service.route";
import ongoingServiceRouter from "./routes/ongoing-service.route";
import { reportRouter } from "./routes/report.route";

const app = express();

app.use(
  cors({
    origin: [config.frontendUrl!],
    credentials: true,
  })
);
app.set("query parser", "extended");
app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Servifi API!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/tables", tableRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/promos", promoRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/ongoing-services", ongoingServiceRouter);
app.use("/api/v1/reports", reportRouter);

app.all("/{*splat}", (req: Request, res: Response) => {
  res.status(404).send("Page not found");
});

app.use(errorHander);

export default app;
