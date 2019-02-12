import {Injectable, NgZone} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {ConstantDbService} from '../constantDbService/constant-db.service';
import { Storage } from '@ionic/storage';


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
        private ngZone: NgZone) {

    }

    checkBluetoothSignal() {
        this.bluetoothTimer = 60 * 1000;
        this.bluetopthThreshold = -74;
        this.bluetopthMaxThreshold = -80;
        this.ngZone.run(
            () => {
                const intervalId = setInterval(() => {
                    this.checkThreshold();
                    let RSSI = null;
                    this.storage.get(this.constDb.BLE_DEVICE).then((val) => {
                        if (val !== null && val !== undefined) {
                            this.bleId = val;
                            if (this.ble.isConnected(this.bleId)) {
                                RSSI = this.ble.readRSSI(this.bleId).then(
                                    (rssi) => {
                                        RSSI = rssi;
                                        if (RSSI != null && RSSI > this.bluetopthThreshold && RSSI < this.bluetopthMaxThreshold) {
                                            console.log('Ok---' + RSSI);
                                        } else {
                                            if ( this.count > 1) {
                                                console.log('error--' + RSSI);
                                                this.count = 0;
                                            }
                                            this.count++;
                                            console.log('Count-->' + this.count);
                                        }
                                    }
                                );
                            } else {
                                console.log('erro');
                            }
                        }
                    });
                }, this.bluetoothTimer);
            }
        );

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
}
