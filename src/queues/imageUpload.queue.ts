import { Queue } from "bullmq";
import redis from "../config/redis";

const imageUploadQueue = new Queue("image-upload-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
  },
});

export const addImageUploadJob = async (
  productId: string,
  imagePath: string
) => {
  await imageUploadQueue.add("upload-image", { productId, imagePath });
};

export default imageUploadQueue;
