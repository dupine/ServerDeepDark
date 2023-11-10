// imports
//const { log } = require('console');
const WebSocketServer = require('ws');

// creazione oggetti
const wss = new WebSocketServer.Server({ port: 3000 })
var storicoMessaggi = [];

// ------------------ CONNESSIONE TRAMITE WEBSOCKET ------------------
wss.on("connection", (ws, richiesta) => {
    ws.id = richiesta.headers['sec-websocket-key'];
    console.log("| Nuovo client sconosciuto connesso: "+ws.id);
    ws.send('Benvenuto! Sei connesso al server, perfavore accedi!');
    
    // gestione richieste in arrivo
    ws.on("message", dati => {
        gestioneRichieste(dati, ws);
    });
 
    // client disconnesso
    ws.on("close", () => {
        console.log("| cliente: "+ws.id+", disconnesso");
    });

    // errore
    ws.onerror = function () {
        console.log("<ERRORE>: si è verificato unn errore")
    }
});
console.log("| The WebSocket server is running on port 3000");



// ------------------ GESTIONE DELLE RICHIESTE ------------------
function gestioneRichieste(dati, ws){
    var campi = String(dati).split("/");
    //data.replace(/\\/," ").replace(/\\/," ");
    //var campi = String(data).split("//");
    switch(campi[0]) {
        // se login
        case "login":
            login(campi[1], campi[2], ws);
            break;

        // se messaggio
        case "messaggio":
            messaggio(campi[1], campi[2], campi[3]);
            break;

        // se storico
        case "storico":
            storico(campi[1], campi[2], ws);
            break;

        // richiesta sconosciuta
        default:
            console.log("<RICHIESTA> richiesta client sconosciuta!");
            ws.send("errore");
      }
}



// ------------------ GESTIONE RICHIESTA LOGIN ------------------
function login(nome, password, ws){
    let trovato = false;
    let nomeEPass = nome+","+password;
    require("fs").readFile("accounts.csv", "utf-8", (err, dati) => {
        if (err) console.log(err);
        else {
            var fileDati = dati.split("\n");
            for(let i = 0; i < fileDati.length && !trovato; i++ ){
                // trim, usato per eliminare spazi all'inizio e fine
                if(nomeEPass==fileDati[i].trim()){
                    console.log("| Autenticazione riconosciuta");
                    ws.nome = nome;
                    ws.autenticato = true;
                    // invio partecipanti a tutti
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
function messaggio(username, dati, messaggio){
    console.log("<RISPOSTA> invio broadcast del messaggio di "+ username+": "+messaggio);
    wss.clients.forEach(function each(client){
        client.send("messaggio/"+username+"/"+dati+"/"+messaggio);
    })

    storicoMessaggi.push([cambiaData(dati), messaggio])
}



// ------------------ INVIO LISTA DEI PARTECIPANTI ------------------
function partecipanti(){
    console.log("<RISPOSTA> invio lista partecipanti a tutti");
    let partecipanti = "listautenti";

    wss.clients.forEach( client => {
        if(client.autenticato) partecipanti += "/"+client.nome;
    })
    wss.clients.forEach( client => {
        if(client.autenticato) client.send(partecipanti);
    })
}



//-----------------STORICO CDEI MESSAGGI---------------------------------
function storico(inizio, fine, ws){
    inizio = cambiaData(inizio);
    fine = cambiaData(fine);
    let dati = "";
    for (let i = 0; i < storicoMessaggi.length; i++) {
        dati = storicoMessaggi[i][0];
        if(inizio<=dati && fine>=dati)
            ws.send(storicoMessaggi[i][1]);
    }
}



function cambiaData(dati){
    let ora, minuto;
    [ora, minuto] = dati.split(":");
    if(ora.length==1) ora = "0"+ora;
    if(minuto.length==1) minuto ="0"+minuto;
    return ora+":"+minuto;
}