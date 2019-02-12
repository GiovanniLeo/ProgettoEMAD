import {Injectable, NgZone} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {ConstantDbService} from '../constantDbService/constant-db.service';
import { Storage } from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root'
})
export class BleService {

    bleId;
    bluetopthThreshold;
    bluetopthMaxThreshold;
    bluetoothTimer;
    count = 0;

    constructor(
        private storage: Storage,
        private ble: BLE,
        private constDb: ConstantDbService,
        private ngZone: NgZone,
        private http: HttpClient,
        private firestore: AngularFirestore) { }

    checkBluetoothSignal() {
        this.bluetoothTimer = 60 * 1000;
        this.bluetopthThreshold = -74;
        this.bluetopthMaxThreshold = -80;
        this.ngZone.run(
            () => {
                const intervalId = setInterval(() => {
                    this.checkThreshold();
                    this.storage.get(this.constDb.BLE_DEVICE).then((val) => {
                        let RSSI = null;
                        if (val !== null && val !== undefined) {
                            this.bleId = val;
                            if (this.ble.isConnected(this.bleId)) {
                                RSSI = this.ble.readRSSI(this.bleId).then(
                                    (rssi) => {
                                        RSSI = rssi;
                                        if (RSSI != null && RSSI > this.bluetopthThreshold && RSSI < this.bluetopthMaxThreshold) {
                                            console.log('Ok---' + RSSI);
                                        } else {
                                            if (this.count > 1) {
                                                console.log('error--' + RSSI);
                                                this.sendNotification();
                                                this.count = 0;
                                            }
                                            this.count++;
                                            console.log('Count-->' + this.count);
                                        }
                                    });
                            } else {
                                console.log('erro');
                            }
                        }
                    });
                }, this.bluetoothTimer);
            });
    }


    checkThreshold() {
        this.storage.get(this.constDb.BLU_ALLARM).then((val) => {
            if (val !== null && val !== undefined) {
                this.bluetopthThreshold = val;
            } else {
                this.bluetopthThreshold = this.constDb.minGeolocationRange;
            }
        });
    }
 sendNotification() {
        if (this.constDb.USER_OBJ !== null) {
            const userJson = JSON.parse(this.constDb.USER_OBJ);

            // getting the token device of the user, and sending via http to cloud function for sending a cloud message to the device
            const device = this.firestore.doc<any>('devices/' + userJson.uid).get();

            // querying the user for the token, parsing to JSON and sending via post
            device.subscribe(tokenUser => {
                const obj = {
                    token: tokenUser.get('token'),
                    nome: userJson.nome,
                    cognome: userJson.cognome
                };

                const jsonUser = JSON.stringify(obj);

                console.log(jsonUser);
                this.http.post('https://us-central1-babysafeseat-6b42d.cloudfunctions.net/sendNotification', jsonUser)
                    .subscribe((data) => {
                        console.log('Notification sended, response: ' + data.toString());
                    }, error => {
                        console.log(error.message);
                    });
            }, error => {
                console.log(error.message);
            });
        } else {
            console.log('Cannot send notification');
        }
    }
}

