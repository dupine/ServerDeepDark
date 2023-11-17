// imports
//const { log } = require('console');
const WebSocketServer = require('ws');

// creazione oggetti e variabili
const wss = new WebSocketServer.Server({ port: 8080 });
var storicoMessaggi = [];



// -------------- connessione tramite websocket -----------------
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
console.log("| The WebSocket server is running on port 8080");



// --------------------- gestione richieste ---------------------
function gestioneRichieste(dati, ws){
    var campi = String(dati).split("/");

    switch(campi[0]) {
        case "login":
            login(campi[1], campi[2], ws);
            break;

        case "messaggio":
            if(ws.autenticato) messaggio(campi[1], campi[2], campi[3]);
            else ws.send("Errore, esegui login!")
            break;

        case "storico":
            if(ws.autenticato) storico(campi[1], campi[2], ws);
            else ws.send("Errore, esegui login!")
            break;

        // richiesta sconosciuta
        default:
            console.log("<RICHIESTA> richiesta client sconosciuta!");
            ws.send("errore");
      }
}



// ------------------ gestione richiesta login ------------------
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



// ------------------ gestione richiesta messaggio --------------
function messaggio(username, data, messaggio){
    console.log("<RISPOSTA> invio broadcast del messaggio di "+ username+": "+messaggio);
    wss.clients.forEach(function each(client){
        client.send("messaggio/"+username+"/"+data+"/"+messaggio);
    })

    storicoMessaggi.push([cambiaData(data), "messaggio/"+username+"/"+data+"/"+messaggio])
}



// ------------------ invio lista dei partecipanti --------------
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



// ------------------ storico dei messaggi ----------------------
function storico(inizio, fine, ws){
    inizio = cambiaData(inizio);
    fine = cambiaData(fine);
    let data = "";
    if(storicoMessaggi.length==0) ws.send("vuoto");
    else for (let i = 0; i < storicoMessaggi.length; i++) {
        data = storicoMessaggi[i][0];
        if(inizio<=data && fine>=data) ws.send(storicoMessaggi[i][1]);
    }
}



// -- funzione per rendere le date dello stesso formato: 00:00 --
function cambiaData(dati){
    let ora, minuto;
    [ora, minuto] = dati.split(":");
    if(ora.length==1) ora = "0"+ora;
    if(minuto.length==1) minuto ="0"+minuto;
    return ora+":"+minuto;
}