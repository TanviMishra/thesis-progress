// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { worldMap } from "./main.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicPath = path.join(new URL("../public", import.meta.url).pathname);
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);
  io.emit("data", worldMap);

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

const PORT = process.env.PORT || 4000;
//to prevent server blocking tyoe stuff
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
