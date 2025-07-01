import { Queue } from "bullmq";
import redis from "../config/redis";

const queue = new Queue("image-delete-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
  },
});

export const deleteImageJob = async (publicId: string) => {
  await queue.add("delete-image", { publicId });
};
