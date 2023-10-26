const WebSocket = require(`ws`);
const ws = new WebSocket.Server({ port: 3000 });

ws.on("connection", (ws) => {
  console.log("Client connected")
  // provo il login
  ws.send('login/matteo11/12345');
  ws.on("message", data => {
    console.log(`Client has sent us: ${data}`)
});
})