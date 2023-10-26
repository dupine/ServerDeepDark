const WebSocket = require(`ws`);
const ws = new WebSocket.Server({ port: 3000 });

ws.on("connection", (ws) => {
  console.log("Client connected")
  ws.send('Welcome, you are connected!');
  ws.on("message", data => {
    console.log(`Client has sent us: ${data}`)
});
})