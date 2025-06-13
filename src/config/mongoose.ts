import mongoose from "mongoose";
import config from "./dotenv";
import logger from "./winston";

export async function connectToDatabase() {
  try {
    if (!config.mongoUri) {
      throw new Error("MONGO_URI is not set on .env");
    }

    const instance = await mongoose.connect(config.mongoUri);

    console.log(
      `Connected to MongoDB at ${instance.connection.host}:${instance.connection.port}`
    );
  } catch (err) {
    if (err instanceof Error) {
      logger.info(err.message + err.stack);
    }
  }
}

export async function disconnectToDatabase() {
  await mongoose.disconnect();
}

export default connectToDatabase;
