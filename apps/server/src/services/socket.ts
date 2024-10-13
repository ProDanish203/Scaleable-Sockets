import { Server } from "socket.io";

class SocketService {
  private _io: Server;
  private pub: any;
  private sub: any;

  constructor(pub: any, sub: any) {
    this.pub = pub;
    this.sub = sub;
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
        await this.pub.publish("Message", JSON.stringify({ message }));
        console.log("Message published");
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
