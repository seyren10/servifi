import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

export type Config = {
  port: number;
  nodeEnv: string;
  mongoUri?: string;
  logDirectory?: string;
};

const config: Config = {
  port: Number(process.env.PORT) || 5500,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  logDirectory: process.env.LOG_DIRECTORY || 'logs'
};

export default config;
