import { Queue, Worker } from "bullmq";
import cloudinary from "../config/cloudinary";
import productModel from "../models/product.model";
import logger from "../config/winston";
import { disconnectToDatabase } from "../config/mongoose";
import redis from "../config/redis";
import config from "../config/dotenv";

export const imageUploadQueue = new Queue("image-upload-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
  },
});

const worker = new Worker(
  "image-upload-queue",
  async (job) => {
    const { productId, imagePath } = job.data;

    const uploadedImage = await cloudinary.uploader.upload(imagePath, {
      folder: "servifi",
      transformation: {
        quality: "auto",
        fetch_format: "auto",
      },
    });

    await productModel.findByIdAndUpdate(productId, {
      imageUrl: uploadedImage.public_id,
    });
  },
  {
    connection: {
      url: config.redisUrl,
    },
    concurrency: 3,
  }
);

worker.on("failed", (job, error) => {
  logger.error(`Job ${job?.id} failed. Error: ${error.message}`);
});

worker.on("completed", (job, res) => {
  logger.info(`${job.name} completed`);
});

worker.on("ready", () => {
  logger.info("Image upload worker is ready...");
});

const shutdown = async () => {
  logger.info("Shutting down worker...");
  await disconnectToDatabase();
  await imageUploadQueue.close();
  await worker.close();
  await redis.quit();

  process.exit(0);
};

(async () => {
  await worker.run();
})();

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
