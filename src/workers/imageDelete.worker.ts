import { Worker } from "bullmq";
import cloudinary from "../config/cloudinary";
import logger from "../config/winston";
import { disconnectToDatabase } from "../config/mongoose";
import redis from "../config/redis";
import config from "../config/dotenv";

const worker = new Worker(
  "image-delete-queue",
  async (job) => {
    const { publicId } = job.data;

    await cloudinary.uploader.destroy(publicId);
  },
  {
    connection: {
      url: config.redisUrl,
    },
    concurrency: 3,
  }
);

worker.on("failed", (job, error) => {
  logger.error(`Job ${job?.name} failed. Error: ${job?.failedReason}`);
});

worker.on("completed", (job, res) => {
  logger.info(`${job.name} completed`);
});

const shutdown = async () => {
  logger.info("Shutting down worker...");
  await disconnectToDatabase();
  await worker.close();
  await redis.quit();
  process.exit(0);
};

(async () => {
  await worker.run();
})();

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
