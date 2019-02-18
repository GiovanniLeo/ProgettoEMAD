# BabySafeSeat

### Dominio del problema

Dimenticare il proprio figlio in auto non è una azione volontaria, compiuta da genitori irresponsabili o superficiali. Si tratta di un fenomeno dovuto alla **amnesia dissociativa**, dove le possibili cause sono: forte stress, mancanza di sonno e stanchezza.

Tale disturbo è dovuto dal fatto che le azioni di routine in alcune situazioni tendono a sopraffare le azioni che dovrebbero compiersi in quel momento, causando una distrazione fatale.

A causa di questo disturbo i casi di bambini morti per essere lasciati in auto sono aumentati in Italia ma anche in altri Paesi. Per evitare di dimenticare il bimbo in auto la nostra app potrebbe essere d' aiuto.

### Descrizione degli attori

I ruoli chiave che si individuano nella nostra applicazione sono:

- Autista

- Angelo

  #### Workflow

  Il CS comunica con l'applicazione attraverso un segnale Bluetooth(*La comunicazione tra la app e ESP-32(Il sensore) non è state delle più semplici poiché ci siamo trovati a lavorare in un ambito a noi sconosciuto e sviluppare in un ambiente multipiattaforma non è stato molto semplice poiché i plugin utilizzati riguardo il BLE(Bluetooth Low Energy) sono molto giovani e scarsi di documentazione*), il quale viene "analizzato" dalla applicazione per verificare se esso si trova in un certo range altrimenti scatta un timer che al termine di esso viene contattato il  back end al fine di inviare la richiesta di aiuto agli angeli associati.


### Sviluppi futuri

La applicazione da noi sviluppata è un app a scopo dimostrativo, ha bisogno di miglioramenti dal punti di vista grafico.

Inoltre un possibile sviluppo futuro potrebbe essere quello di integrare la funzionalità di allarme della app con l'antifurto dell'automobile. 