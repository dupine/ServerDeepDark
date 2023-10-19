const WebSocket = require(`ws`);
const ws = new WebSocket.Server({ port: 3000 });

ws.on("connection", (ws) => {
  console.log("I'm server")
  let msg = "Connection Established!. M2C!";
  ws.send(JSON.stringify(msg));
});


