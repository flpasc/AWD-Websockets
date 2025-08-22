import express from "express";
import cors from "cors";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";

const PORT = process.env.BACKEND_PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.static("public"));

const wss = new WebSocketServer({ server, path: "/ws" });

app.get("/", (req, res) => {
  res.send("hello backend");
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send("Hello from server");

  ws.on("message", (msg) => {
    console.log("Reveiced", msg.toString());

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${msg}`);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client Disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
