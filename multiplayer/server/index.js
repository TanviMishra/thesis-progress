// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { worldMap } from "./islandGen.js";
let localWorldMap = JSON.parse(JSON.stringify(worldMap));

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicPath = path.join(new URL("../public", import.meta.url).pathname);
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

io.on("connection", (socket) => {
  socket.on("connect", () => {
    // console.log(`Socket ${socket.id} connected`);
  });
  socket.on("start", () => {
    io.emit("start", localWorldMap);
  });
  socket.on("mapChange", (map) => {
    localWorldMap = JSON.parse(JSON.stringify(map));
    socket.broadcast.emit("mapChange", localWorldMap);
    socket.emit("mapChange", localWorldMap);
    // io.emit("mapChange", localWorldMap);
  });
  socket.on("disconnect", () => {
    // console.log(`Socket ${socket.id} disconnected`);
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
