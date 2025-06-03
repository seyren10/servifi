import { Server } from "socket.io";
import config from "./dotenv";

let io: Server;
export const createSocketServer = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: config.frontendUrl,
    },
  });
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};
