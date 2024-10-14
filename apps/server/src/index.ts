import http from "http";
import SocketService from "./services/socket";
import { getRedisClient } from "./services/redis";

async function init() {
  const { pub, sub } = await getRedisClient();
  const socketService = new SocketService(pub, sub);
  const server = http.createServer();
  const PORT = process.env.PORT || 8000;

  socketService.io.attach(server);
  await socketService.initListeners();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

init().catch(console.error);
