const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();

exports.sendNotificationToAngels = functions.https.onRequest((request, response) => {

    cors(request, response, () => {
        const tokens = [];
        const uid = JSON.parse(request.body).uid;
        console.log(uid);

        // Notification content
        // inviare coordinate ad angeli
        /*
        const payload = {
            notification: {
                title: 'Bambino dimenticato!',
                body: `Hey! L'angelo a cui sei associato sta dimenticando un bambino!`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
        };
*/



        firestore.collection('association', ref => ref.where('uidAutista', '==', uid)).get().then(users => {

            users.forEach(user => {
                firestore.collection('devices').doc(user.get('uidAngelo')).get().then(tok => {
                    //non riesco a prendere il token, il foreach funziona.
                        console.log("token " + tok.token);
                });
            });

            tokens.forEach(tok => {
                console.log('tok-' + tok);
            });

        }).catch(err => {
            console.log(err.message);
        });



        // click sulla notifica deve aprirsi la mappa nel dispositivo
        //const stat = admin.messaging().sendToDevice((token === undefined) ? [] : token, payload);

        const objStatus = {
            status: '',
            lat: '',
            long: ''
        };

        response.status(200).send(JSON.stringify(objStatus));
    });

});


exports.sendNotification = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        // Notification content
        const payload = {
            notification: {
                title: 'Bambino dimenticato!',
                body: `Hey! L'angelo a cui sei associato sta dimenticando un bambino!`,
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

