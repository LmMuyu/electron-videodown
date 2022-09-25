import socket from "socket.io-client";
import ss from "socket.io-stream";

export default function connectSocket(
  host?: string,
  port?: number | string,
  callback?: (stream: any) => void
) {
  if (!host) host = "127.0.0.1";
  if (!port) port = "3000";

  console.log("开始连接socket服务器");

  const ip = `ws://${host}:${port}`;
  const io = socket(ip).connect();

  io.on("connect", () => {
    console.log("socket服务器已链接");
    ss(io).on("videostream", callback ?? (() => {}));
  });

  io.on("error", (err) => {
    console.log(err);
  });

  io.on("disconnect", () => {
    console.log("socket服务器已断开");
  });

  return io;
}
