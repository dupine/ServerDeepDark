# ServerDeepDark
Repositori privato del server di Manuel Marsili ed Antonio Pino. In questo reporitory trattiamo di un server da noi creato , che ci permetterà di creare una chat broadcast.

![N|Solid](https://staticg.sportskeeda.com/editor/2022/05/7404c-16538050507160-1920.jpg?w= "foto bioma Deep Dark")

Il nome DeepDark fa riferimento ad il bioma di minecraft, presente nelle caverne. Dove è presente il mob più forte, o forse dovrei dire... server più forte! XD

#### E come disse Blitzcrank:
> Operativo e pronto ad afferrare... richieste!
---

# Protocollo RBTTP
Per la comunicazione abbiamo creato un nuovo protocollo, RBTTP(Rapid Broadcast Text Transfer Protocoll).
### 1) Funzionamento protocollo
Nella prima parte della descrizione del protocollo tratteremo come funziona in maniera generale, per poi entrare più nel dettaglio successivamente. La separazione dei campi sarà fatta tramite la **virgola**.
#### 1.1) Autenticazione
parola chiave = ``login``
```
login,username,password

Esempio:
login,loremIpsum,123456
```
#### 1.2) Messaggio
parola chiave = ``messaggio``.
```
messaggio,username,hh:mm,testo

Esempio:
messaggio,loremIpsum,10:55,vi aspetto in aula 154!
```
#### 1.3) Storico
Grazie alla richiesta dello storico si potranno ottenere tutti i messsaggi desiderati di un certo intervallo di tempo.
parola chiave = ``storico``.
```
storico,hh:mm,hh:mm

Esempio:
storico,10:55,11:55
```
#### 1.3) Partecipanti
Se necessitiamo di sapere gli utenti attivi al momento possiamo utilizzare questa richiesta.
Parola chiave = ``listautenti``.
