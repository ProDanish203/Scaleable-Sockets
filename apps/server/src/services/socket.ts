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

  public async initListeners() {
    const io = this.io;

    io.on("connection", (socket) => {
      console.log("New connection", socket.id);

      socket.on("message", async ({ message }: { message: string }) => {
        await this.pub.publish("Messages", JSON.stringify({ message }));
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
      });
    });
    await this.sub.subscribe("Messages", (message: any) => {
      io.emit("message", JSON.parse(message));
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
