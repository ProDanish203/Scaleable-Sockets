import { Server } from "socket.io";
import { createClient } from "redis";

const pub = createClient({
  url: process.env.REDIS_URI,
});

const sub = createClient({
  url: process.env.REDIS_URI,
});

class SocketService {
  private _io: Server;
  constructor() {
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });
  }

  public initListeners() {
    const io = this.io;
    console.log("Initializing socket listeners");
    io.on("connection", (socket) => {
      console.log("New connection", socket.id);

      socket.on("message", async ({ message }: { message: string }) => {
        console.log("Message received: ", message);
        // Publish the message to all connected clients
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
