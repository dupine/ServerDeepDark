// imports
const WebSocketServer = require('ws');

// creao oggetto webSocket
const wss = new WebSocketServer.Server({ port: 3000 })

// connection using websocket
wss.on("connection", ws => {
    console.log("new client connected");
    ws.send('Welcome, you are connected!');
 
    // gestione messaggi
    ws.on("message", data => {
        commandHanlder(data);
    });
 
    // on disconnection
    ws.on("close", () => {
        console.log("the client has connected");
    });

    // client errors
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log("The WebSocket server is running on port 3000");

function commandHanlder(data){
    var campi = String(data).split("/");
    console.log("s");
    switch(campi[0]) {
        case "login":
            login(campi[1], campi[2]);
            break;
        case "messaggio":
            // code block
            break;
        case "storico":
            //
            break;
        default:
          console.log("comando sconosciuto!");
      }
}

function login(_nome, _password){
    let i=0;
    let trovato=false;
    const fs = require("fs");
    fs.readFile("accounts.csv", "utf-8", (err, data) => {
        if (err) console.log(err);
        else {
          let fileData = data.split("\n");
          let autenticazione = _nome +","+_password;
            fileData.forEach(element => {
               for(i; i<fileData.length; i++ ){
                    if(autenticazione==fileData[i]){
                        console.log("Autenticazione Riconosciuta");
                    }else{
                        console.log("non conosciuto");
                    }
                }
            })
        }
    });


}