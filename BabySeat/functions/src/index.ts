const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();

exports.sendNotificationToAngels = functions.https.onRequest((request, response) => {

    cors(request, response, () => {
        let tokens: string[] = [];

        const uid = JSON.parse(request.body).uid;
        const lat = JSON.parse(request.body).lat;
        const long = JSON.parse(request.body).long;
        const nome = JSON.parse(request.body).nome;
        const cognome = JSON.parse(request.body).cognome;

        console.log('Richiesta pervenuta da autista: ' + uid);

        // Notification content
        // inviare coordinate ad angeli

        const payload = {
            notification: {
                title: 'Serve il tuo aiuto!',
                body: `Hey! ` + nome + ` ` + cognome + ` ` + ` sta dimenticando un bambino! Corri in aiuto!`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
        };




        firestore.collection('association', ref => ref.where('uidAutista', '==', uid)).get().then(associations => {
            let uidAngelo;
            const size = associations.size;

            console.log('Numero di angeli associato: ' + associations.size);
            let i = 1;

            // for each associations
            associations.forEach(ass => {
                uidAngelo = ass.get('uidAngelo');

                // getting the token of the angel that has to receive the notification
                firestore.collection('devices').doc(uidAngelo).get().then(tok => {
                    tokens.push(tok.get('token'));

                    // waiting for the end of the angels's search
                    if (i === size){

                        // click sulla notifica deve aprirsi la mappa nel dispositivo
                        const stat = admin.messaging().sendToDevice(tokens, payload);

                        const objStatus = {
                            status: stat,
                            nome: nome,
                            cognome: cognome,
                            lat: lat,
                            long: long
                        };

                        response.status(200).send(JSON.stringify(objStatus));

                    } else {
                        i = i + 1;
                    }
                });

            });

        }).catch(err => {
            console.log(err.message);
        });
    });



});


exports.sendNotification = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        // Notification content
        const payload = {
            notification: {
                title: 'Bambino dimenticato!',
                body: `Hey! Torna in auto! Se non disattivi l'allarme e torni in auto, saranno avvisati gli angeli associati!`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
        };

        const token = JSON.parse(request.body).token;

        console.log(token);


        // on click notific
        const stat = admin.messaging().sendToDevice((token === undefined) ? [] : token, payload);

        const objStatus = {
            status: stat
        };

        response.status(200).send(JSON.stringify(objStatus));
    });

});

