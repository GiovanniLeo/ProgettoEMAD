import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {Router} from '@angular/router';
import {ConstantDbService} from '../services/constantDbService/constant-db.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
})
export class ConfigurationPage implements OnInit {


  maxGeolocationRange = 20; // minuti
  maxBluetoothAllarm = -80; // threshold(Dipende dal bluetooth)
  maxRangeAllarmDeactivation = 120; // secondi
  maxBluetoothPowerGeolocation = -80;

  userGeolocation: number; // minuti
  userBluetoothAllarm: number; // threshold(Dipende dal bluetooth)
  userAllarmDeactivation: number; // secondi
  UserBluetoothPowerGeolocation: number; // threshold(Dipende dal bluetooth)

  geolocationRangeMessage = 'Indicare la frenquenza (in minuti) di invio della posizione al server.';
  bluetoothAllarmMessage = 'Indicare la soglia sotta la quale si attiva la seganalazione di pericolo.';
  rangeAllarmDeactivationMessage = 'Indicare il tempo (in secondi) entro il quale disattivare la segnalazione sonora.';
  bluetoothPowerGeolocationMessage = 'Indicare la soglia sopra la quala si avvia la comunicazione della posizione al server.';


  constructor(private toastController: ToastController, private storage: Storage, private router: Router,
              private constDb: ConstantDbService) {}

  ngOnInit() {
    this.initialSet();
  }

  async presentToastWithOptions(message: string) {
    console.log(message);
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Chiudi'
    });
    toast.present();
  }

  saveTodb() {

    this.storage.set(this.constDb.GEO_RANGE, this.userGeolocation);
    this.storage.set(this.constDb.BLU_ALLARM, this.userBluetoothAllarm);
    this.storage.set(this.constDb.ALLARM_DEACT, this.userAllarmDeactivation);
    this.storage.set(this.constDb.BLUE_GEO, this.UserBluetoothPowerGeolocation);

    console.log('Saved');
    this.router.navigate(['/home']);
  }

  initialSet() {
    this.storage.get(this.constDb.GEO_RANGE).then((val) => {
      if (val !== null && val !== undefined) {
        this.userGeolocation = val;
      } else {
        this.userGeolocation = this.constDb.minGeolocationRange;
      }
    });

    this.storage.get(this.constDb.BLU_ALLARM).then((val) => {
      if (val !== null && val !== undefined) {
        this.userBluetoothAllarm = val;
      } else {
        this.userBluetoothAllarm = this.constDb.minBluetoothAllarm;
      }
    });

    this.storage.get(this.constDb.ALLARM_DEACT).then((val) => {
      if (val !== null && val !== undefined) {
        this.userAllarmDeactivation = val;
      } else {
        this.userAllarmDeactivation = this.constDb.minRangeAllarmDeactivation;
      }
    });

    this.storage.get(this.constDb.BLUE_GEO).then((val) => {
      if (val !== null && val !== undefined) {
        this.UserBluetoothPowerGeolocation = val;
      } else {
        this.UserBluetoothPowerGeolocation = this.constDb.minBluetoothPowerGeolocation;
      }
    });
  }


  clearDb() {
    this.storage.clear();
    this.initialSet();
  }


}
