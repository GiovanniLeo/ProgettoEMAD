const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
admin.initializeApp();

exports.notification = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        // Notification content
        const payload = {
            notification: {
                title: 'Prova',
                body: `ciao!`,
                icon: 'https://goo.gl/Fz9nrQ'
            }
        };

        const token = JSON.parse(request.body).token;

        console.log(token);

        const stat = admin.messaging().sendToDevice((token === undefined) ? [] : token, payload);

        const objStatus = {
            status: stat
        };

        response.status(200).send(JSON.stringify(objStatus));
    });

});
