import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

import * as admin from 'firebase-admin';
admin.initializeApp();


exports.sendNotification = functions.firestore
    //.document('subscribers/{subscriptionId}')
    .document('users/')
    .onCreate(async event => {

        // Notification content
        const payload = {
            notification: {
                title: 'Prova',
                body: `Notifica`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
        };

        // ref to the device collection for the user
        const db = admin.firestore();
        const device = db.doc('devices/' + user.uid).get();
        device.subscribe(tokenUser => {
            const token = tokenUser.get('token');



            admin.messaging().sendToDevice(token, payload);
        }, error => {
            console.log(error.message);
        });
        // get the user's tokens and send notifications
        const devices = await devicesRef.get();

        let tokens: string[] = [];

        // send a notification to each device token
        // getting tokens for each device, to send notifications
        devices.forEach(result => {
            const token = result.data().token;

            tokens.push( token );
        });

        return admin.messaging().sendToDevice(tokens, payload);

    });

