import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://13.239.240.242:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle video call signaling
  socket.on("callUser", (data) => {
    const { from, to, signal } = data;
    const toSocketId = userSocketMap[to];
    if (toSocketId) {
      io.to(toSocketId).emit("incomingCall", { from, signal });
    }
  });

  socket.on("acceptCall", (data) => {
    const { to, signal } = data;
    const toSocketId = userSocketMap[to];
    if (toSocketId) {
      io.to(toSocketId).emit("callAccepted", signal);
    }
  });

  socket.on("endCall", (data) => {
    const { to } = data;
    const toSocketId = userSocketMap[to];
    if (toSocketId) {
      io.to(toSocketId).emit("callEnded");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
