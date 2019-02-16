import {Injectable, NgZone} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {ConstantDbService} from '../constantDbService/constant-db.service';
import { Storage } from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {GeolocationService} from '../geolocationService/geolocation.service';
import {Router} from '@angular/router';
import {ToastService} from '../toastService/toast.service';


@Injectable({
    providedIn: 'root'
})
export class BleService {

    bleId;
    bluetopthThreshold;
    bluetopthMaxThreshold;
    bluetopthDangerThreshold;
    bluetoothTimer;
    count = 0;

    constructor(
        private storage: Storage,
        private ble: BLE,
        private constDb: ConstantDbService,
        private ngZone: NgZone,
        private http: HttpClient,
        private firestore: AngularFirestore,
        private gelocationService: GeolocationService,
        private router: Router,
        private toastSer: ToastService) { }

    checkBluetoothSignal() {
        this.bluetoothTimer = 20 * 1000;
        this.bluetopthThreshold = -60;
        this.bluetopthMaxThreshold = -80;
        this.ngZone.run(
            () => {
                const intervalId = setInterval(() => {
                    this.checkThreshold();
                    this.storage.get(this.constDb.BLE_DEVICE).then((val) => {
                        let RSSI = null;
                        if (val !== null && val !== undefined) {
                            this.bleId = val;
                            this.ble.isConnected(this.bleId).then(
                                () => {
                                    // on success
                                    RSSI = this.ble.readRSSI(this.bleId).then(
                                        (rssi) => {
                                            RSSI = rssi;
                                            if (RSSI != null ) {
                                                RSSI = RSSI * -1;
                                                this.bluetopthThreshold = this.bluetopthThreshold * -1;
                                                this.bluetopthMaxThreshold =  this.bluetopthMaxThreshold * -1;
                                                if (RSSI > this.bluetopthThreshold && RSSI < this.bluetopthMaxThreshold) {
                                                    console.log('Ok checkB--->' + RSSI);
                                                } else {
                                                    if (this.count >= 1) {
                                                        console.log('error--' + RSSI);
                                                        this.sendNotification();
                                                        this.count = 0;
                                                    }
                                                    this.gelocationService.getPositionOnDevice(true);
                                                    this.count++;
                                                    console.log('Count-->' + this.count);
                                                }
                                            }
                                        });
                                }, () => {
                                    // on failure
                                    console.log('erro');
                                });
                        }
                    });
                }, this.bluetoothTimer);
            });
    }

    checkBluetoothSignalForPosition(role: string) {
        this.bluetopthDangerThreshold = -77;
        this.ngZone.run(
            () => {
                const intervalId = setInterval(() => {
                    this.checkThreshold();
                    console.log('bluetopthDangerThreshold' + '-->' + this.bluetopthDangerThreshold);
                    this.storage.get(this.constDb.BLE_DEVICE).then((val) => {
                        let RSSI = null;
                        if (val !== null && val !== undefined) {
                            this.bleId = val;
                            this.ble.isConnected(this.bleId).then(
                                () => {
                                    // on succes
                                    RSSI = this.ble.readRSSI(this.bleId).then(
                                        (rssi) => {
                                            RSSI = rssi;
                                            if (RSSI != null ) {
                                                RSSI = RSSI * -1;
                                                console.log('bluetopthDangerThreshold--RSSI' + '-->' + RSSI);
                                                this.bluetopthDangerThreshold = this.bluetopthDangerThreshold * -1;
                                                if (RSSI > this.bluetopthDangerThreshold) {
                                                    this.gelocationService.getBackGroundPosition(role);
                                                }
                                            }
                                        });
                                },
                                () => {
                                    console.log('erro');
                                }
                            );
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
        this.storage.get(this.constDb.BLUE_GEO).then((val) => {
            if (val !== null && val !== undefined) {
                this.bluetopthDangerThreshold = val;
            } else {
                this.bluetopthDangerThreshold = this.constDb.minBluetoothPowerGeolocation;
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

    enableBle() {
        this.ble.isEnabled().then(
            () => {
                // on success
                this.router.navigate(['/ble-connet']);
            },
            () => {
                // on failure
                this.ble.enable().then(() => {
                    // on succes
                    this.router.navigate(['/ble-connet']);
                }, () => {
                    // on failure
                    const msg = 'Per connetterti ad un dispositivo devi attivare il bluetooth';
                    this.toastSer.presentToastWithOptions(msg);
                });
            }
        );

    }
}

