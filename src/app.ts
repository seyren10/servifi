import morgan from "morgan";
import express, { Request, Response } from "express";
import cors from "cors";

import config from "./config/dotenv";
import { errorHander } from "./middleware/errorHandler";
import categoryRouter from "./routes/category.route";
import productRouter from "./routes/product.route";
import tableRouter from "./routes/table.route";

const app = express();

app.use(
  cors({
    origin: config.frontendUrl!,
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

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/tables", tableRouter);

app.all("/{*splat}", (req: Request, res: Response) => {
  res.status(404).send("Page not found");
});

app.use(errorHander);

export default app;
