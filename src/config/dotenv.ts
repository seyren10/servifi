import jwt from "jsonwebtoken";

export type Config = Partial<{
  port: number;
  nodeEnv: string;
  mongoUri: string;
  logDirectory: string;
  appUrl: string;
  frontendUrl: string;
  jwtSecret: string;
  jwtExpiresIn: jwt.SignOptions["expiresIn"];
  cloudinaryName: string;
  cloudinaryApiKey: string;
  cloudinarySecretKey: string;
  redisUrl: string;
}>;

const config: Config = {
  port: Number(process.env.PORT) || 5500,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  logDirectory: process.env.LOG_DIRECTORY || "logs",
  appUrl: process.env.APP_URL,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:8000",
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ||
    "1d") as jwt.SignOptions["expiresIn"],
  jwtSecret: process.env.JWT_SECRET,
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinarySecretKey: process.env.CLOUDINARY_API_SECRET,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
};

if (!config.appUrl) {
  config.appUrl = `http://localhost:${config.port}`;
}

if (!config.jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export default config;
