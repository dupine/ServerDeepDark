# Server DeepDark
Repositori privato del server di **Marsili Manuel** e **Pino Antonio**. In questa documentazione introduciamo il nostro progetto di server broadcast.

![N|Solid](https://staticg.sportskeeda.com/editor/2022/05/7404c-16538050507160-1920.jpg?w= "foto bioma Deep Dark")

_Il nome DeepDark fa riferimento al bioma di minecraft dove è presente un mob ostile(server) che dialoga con le sue stazioni(client) tramite ultrasuoni._

#### Motto, parole di Blitzcrank:
> Operativo e pronto ad afferrare... richieste!
---

# Protocollo RBTTP
Per la comunicazione abbiamo creato un nuovo protocollo, RBTTP(Rapid Broadcast Text Transfer Protocoll). Esso lavoro in **broadcast**, ovvvero, quando un client fà una query, il server invierà la risposte a tutti i partecipanti. Visto che non vogliamo che chiunque possa inviare richieste ma solo persone che noi conosciamo, abbiamo inserito una richiesta di accesso o autenticazione che permetta ai soli registrati di accedere e dialogare. Di seguito troviamo le varie richieste possibili e le eventuali risposte.
### Funzionamento protocollo
Nella prima parte della descrizione del protocollo tratteremo come funziona in maniera generale, per poi entrare più nel dettaglio successivamente. La separazione dei campi sarà fatta tramite la **virgola**.

#### 1.1) Autenticazione
Parola chiave = ``login``
```
login/username/password

Esempio:
login/loremIpsum/123456
```
#### 1.2) Messaggio
Parola chiave = ``messaggio``.
```
messaggio/username/hh:mm/testo

Esempio:
messaggio/loremIpsum/10:55/vi aspetto in aula 154!
```
#### 1.3) Storico
Grazie alla richiesta dello storico si potranno ottenere tutti i messsaggi desiderati di un certo intervallo di tempo.
Parola chiave = ``storico``.
```
storico/hh:mm/hh:mm

Esempio:
storico/10:55/11:55
```
#### 1.3) Partecipanti
Se necessitiamo di sapere gli utenti attivi al momento possiamo utilizzare questa richiesta che è formata solamente dalla parola chiave.
Parola chiave = ``listautenti``.
