import {Component, NgZone, OnInit} from '@angular/core';
import {BLE} from '@ionic-native/ble/ngx';
import {ToastService} from '../services/toastService/toast.service';
import { Storage } from '@ionic/storage';
import {ConstantDbService} from '../services/constantDbService/constant-db.service';
import {Router} from '@angular/router';
import {delay} from 'rxjs/operators';

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
              private constDb: ConstantDbService,
              private router: Router) {}

  ngOnInit() {
  }

  scan() {
    this.setStatus('Scansione device Bluetooth LE ');
    this.devices = [];  // clear list

    this.ble.scan([], 5).subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scansione completetata');
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
    this.toastService.presentToastTimeout('Errore durante la scansione dei device Bluetooth low energy ',
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
    this.ble.isConnected(this.peripheral.id).then(
        () => {
          // on success
          this.storage.set(this.constDb.BLE_DEVICE, this.peripheral.id);
          this.ble.readRSSI(this.peripheral.id).then(
              (rssi) => {
                console.log('RSSI: ' + rssi );
                // this.setStatus('RSSI: ' + rssi );
              }
          );
          this.setStatus('Connesso a ' + this.peripheral.name);

          setTimeout(() => {
                 this.router.navigate(['/home']);
              },
              3000);
        },
        () => {
          // on failure
          this.setStatus('Prova a riconnetterti a ' + this.peripheral.name);
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
