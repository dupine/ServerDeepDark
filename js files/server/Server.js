// imports
const { log } = require('console');
const WebSocketServer = require('ws');

// creazione oggetti
const wss = new WebSocketServer.Server({ port: 3000 })
var storicoMessaggi = [];

// ------------------ CONNESSIONE TRAMITE WEBSOCKET ------------------
wss.on("connection", (ws, req) => {
    ws.id = req.headers['sec-websocket-key'];
    console.log("| Nuovo client sconosciuto connesso: "+ws.id);
    ws.send('Benvenuto! Sei connesso al server, perfavore accedi!');
    
    // gestione messaggi
    ws.on("message", data => {
        gestioneRichieste(data, ws);
    });
 
    // client disconnesso
    ws.on("close", () => {    
        console.log("| cliente: "+ws.id+", disconnesso");
    });

    // errori client
    ws.onerror = function () {
        console.log("<ERRORE>: si è verificato unn errore")
    }
});
console.log("| The WebSocket server is running on port 3000");



// ------------------ GESTIONE DELLE RICHIESTE ------------------
function gestioneRichieste(data, ws){
    // messaggio/matteo/12:43/incontriamoci alle 8/8.30
    var campi = String(data).split("/");
    // TODO: aggiungere che se un utente non si è prima loggato, non può fare niente.
    //data.replace(/\\/," ").replace(/\\/," ");
    //var campi = String(data).split("//");
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
            storico(campi[1], campi[2], ws);
            break;

        default:
            console.log("<RICHIESTA> richiesta client sconosciuta!");
            ws.send("errore");
      }
}



// ------------------ GESTIONE RICHIESTA LOGIN ------------------
function login(nome, password, ws){
    let trovato = false;
    let nomeEPass = nome+","+password;
    require("fs").readFile("accounts.csv", "utf-8", (err, data) => {
        
        if (err) console.log(err);
        else {
            var fileData = data.split("\n");
            for(let i = 0; i < fileData.length && !trovato; i++ ){
                if(nomeEPass==fileData[i].trim()){
                    console.log("| Autenticazione riconosciuta");
                    ws.nome = nome;
                    ws.autenticato = true;
                    partecipanti();
                    trovato = true;
                }
            }

            if(!trovato){
                console.log("| Autenticazione fallita, disconnessione utente.")
                ws.close(); 
            }
        }
    });
}



// ------------------ GESTIONE RICHIESTA MESSAGGIO ------------------
function message(username, data, messaggio){
    console.log("<RISPOSTA> invio broadcast del messaggio di "+ username+": "+messaggio);
    wss.clients.forEach(function each(client){
        client.send("messaggio/"+username+"/"+data+"/"+messaggio);
    })

    storicoMessaggi.push([changeData(data), messaggio])
}



// ------------------ INVIO LISTA DEI PARTECIPANTI ------------------
function partecipanti(){
    console.log("<RISPOSTA> invio lista partecipanti a tutti");
    let partecipanti = "";

    wss.clients.forEach( client => {
        if(client.autenticato) partecipanti += client.nome+" ";
    })
    wss.clients.forEach( client => {
        if(client.autenticato) client.send("Autenticazione riuscita. Lista partecipanti: "+partecipanti);
    })
}



//-----------------STORICO CDEI MESSAGGI---------------------------------
function storico(inizio, fine, ws){
    inizio = changeData(inizio);
    fine = changeData(fine);
    let data = "";
    for (let i = 0; i < storicoMessaggi.length; i++) {
        data = storicoMessaggi[i][0];
        if(inizio<=data && fine>=data)
            ws.send(storicoMessaggi[i][1]);
    }
}



function changeData(data){
    let hour, minute;
    [hour, minute] = data.split(":");
    if(hour.length==1) hour = "0"+hour;
    if(minute.length==1) minute ="0"+minute;
    return hour+":"+minute;
    
}