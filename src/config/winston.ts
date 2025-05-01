import { createLogger, transports, format } from "winston";
import path from "path";
import config from "./dotenv";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";

let dir = config.logDirectory;

if (!dir) dir = path.resolve("logs");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const logLevel = config.nodeEnv === "development" ? "debug" : "warn";

const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  filename: "%DATE%-results.log",
  dirname: dir,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  handleExceptions: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json()
  ),
});

const logger = createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.colorize(),
        format.prettyPrint()
      ),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false,
});

export default logger;
