import {Component, NgZone, OnInit} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {ToastService} from '../services/toastService/toast.service';
import { Storage } from '@ionic/storage';
import {ConstantDbService} from '../services/constantDbService/constant-db.service';

@Component({
  selector: 'app-ble-connet',
  templateUrl: './ble-connet.page.html',
  styleUrls: ['./ble-connet.page.scss'],
})
export class BleConnetPage implements OnInit {

  devices: any[];
  statusMessage: string;
  peripheral: any = {};

  constructor(private ble: BLE,
              private ngZone: NgZone,
              private toastService: ToastService,
              private storage: Storage,
              private constDb: ConstantDbService) {}

  ngOnInit() {
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    this.ble.scan([], 5).subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
      console.log(this.devices);
    });
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
    this.toastService.presentToastTimeout('Error scanning for Bluetooth low energy devices',
        'middle');
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    this.ble.connect(device.id).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => this.setStatus('Prova a riconnetterti')
    );
  }

  onConnected(peripheral) {

    this.peripheral = peripheral;
    this.setStatus('Connected to ' + (peripheral.name || peripheral.id));
    this.storage.set(this.constDb.BLE_DEVICE, this.peripheral.id);
    this.ble.readRSSI(this.peripheral.id).then(
        (rssi) => {
          console.log('RSSI: ' + rssi );
          this.setStatus('RSSI: ' + rssi );
        }
    );

  }



  // showAlert(title, message) {
  //   let alert = this.alertCtrl.create({
  //     title: title,
  //     subTitle: message,
  //     buttons: ['OK']
  //   });
  //   alert.present();
  // }



}
