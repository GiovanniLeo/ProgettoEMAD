import {Injectable, NgZone} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {ConstantDbService} from '../constantDbService/constant-db.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  bleId;

  constructor(
      private storage: Storage,
      private ble: BLE,
      private constDb: ConstantDbService,
      private ngZone: NgZone) { }

  checkBluetoothSignal() {
    this.ngZone.run(
        () => {
          const intervalId = setInterval(() => {
            let RSSI = null;
            this.storage.get(this.constDb.BLE_DEVICE).then((val) => {
              if (val !== null && val !== undefined) {
                this.bleId = val;
                if (this.ble.isConnected(this.bleId)) {
                  RSSI = this.ble.readRSSI(this.bleId).then(
                      (rssi) => {
                        RSSI = rssi;
                        if (RSSI != null && RSSI > -79) {
                          console.log('Ok---' + RSSI);
                        } else {
                          console.log('error--' + RSSI);
                        }
                      }
                  );
                } else {
                  console.log('erro');
                }
              }
            });
          }, 5000);
        }
    );

  }
}
