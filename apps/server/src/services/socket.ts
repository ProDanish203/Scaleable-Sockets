import { Server } from "socket.io";

class SocketService {
  private _io: Server;
  constructor() {
    this._io = new Server();
  }

  public initListeners() {
    const io = this.io;
    console.log("Initializing socket listeners");
    io.on("connection", (socket) => {
      console.log("New connection", socket.id);

      socket.on("message", async ({ message }: { message: string }) => {
        console.log("Message received: ", message);
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
