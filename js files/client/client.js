const WebSocket = require('ws');
const prompt = require("prompt-sync")();

// collegamento a
const ws = new WebSocket("ws://localhost:3000");

ws.addEventListener("open", () =>{
  console.log("| WE ARE CONNECTED");
});

ws.addEventListener('message', function (event) {
    console.log("<server>: "+event.data);
    inputMessage();
});

ws.on('close', () => {
  console.log('| Disconnected from server');
});

function inputMessage(){
  const input = prompt(">> ");
  if(input == "") ws.close();
  ws.send(input);
}