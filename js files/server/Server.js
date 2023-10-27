// imports
const WebSocketServer = require('ws');

// creao oggetto webSocket
const wss = new WebSocketServer.Server({ port: 3000 })

// connection using websocket
wss.on("connection", ws => {

    console.log("----- new client connected -----");
    ws.send('Welcome, you are connected!');
    
    // gestione messaggi
    ws.on("message", data => {
        commandHanlder(data, ws);
    });
 
    // on disconnection
    ws.on("close", () => {
        console.log("the client has disconnected");
    });

    // client errors
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log("The WebSocket server is running on port 3000");

function commandHanlder(data, ws){
    var campi = String(data).split("/");

    switch(campi[0]) {
        // se login
        case "login":
            login(campi[1], campi[2], ws);
            break;

        // se messaggio
        case "messaggio":
            message(campi[1], campi[2], campi[3]);
            break;

        // se storico
        case "storico":
            break;

        default:
          console.log("comando sconosciuto!");
      }
}


// gestione richiesta di login
function login(nome, password, ws){
    let trovato = false;
    let nomeEPass = nome+","+password;
    require("fs").readFile("accounts.csv", "utf-8", (err, data) => {
        
        // se errore
        if (err) console.log(err);
        
        // cerco la corrispondenza
        else {
            // l'editor di windows aggiuge il \r ovver il carriage return, per dire di mettere il cursore all'inizio della prossima linea
            var fileData = data.split("\n");

            for(let i = 0; i < fileData.length && !trovato; i++ ){
                if(nomeEPass==fileData[i].trim()){
                    console.log("Autenticazione Riconosciuta");
                    ws.nome = nome;
                    partecipanti();
                    trovato = true;
                }
            }

            if(!trovato){
                console.log("Autenticazione fallita, disconnessione utente.")
                ws.close(); 
            }
        }
    });
}


// gestione richiesta di messaggio
function message(username, data, messaggio){
    console.log(">> invio broadcast del messaggio di "+ username+": "+messaggio);
    wss.clients.forEach(function each(client){
        client.send("messaggio/"+username+"/"+data+"/"+messaggio);
    })
}

// invio lista dei partecipanti
function partecipanti(){
    console.log(">> invio lista partecipanti a tutti");
    let partecipanti = "";
    wss.clients.forEach(function each(client){
       partecipanti+=client.nome+" ";
    })
    // no, falla simile
    message("", "", partecipanti)
}
