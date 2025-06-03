import app from "./app";
import config from "./config/dotenv";
import connectToDatabase from "./config/mongoose";
import { createServer } from "http";
import { createSocketServer } from "./config/socket";

const server = createServer(app);

const io = createSocketServer(server);

server.listen(config.port!, async () => {
  console.log(`App listening to port ${config.port}`);
  await connectToDatabase();
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("leave-room", (roomId: string) => {
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {});
});
