import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
})
export class ConfigurationPage implements OnInit {

  minGeolocationRange = 1; // minuti
  maxGeolocationRange = 20; // minuti
  minBluetoothAllarm = 1; // threshold(Dipende dal bluetooth)
  maxBluetoothAllarm = 5; // threshold(Dipende dal bluetooth)
  minRangeAllarmDeactivation = 30; // secondi
  maxRangeAllarmDeactivation = 120; // secondi
  minBluetoothPowerGeolocation = 1;
  maxBluetoothPowerGeolocation = 5;

  userGeolocation: number; // minuti
  userBluetoothAllarm: number; // threshold(Dipende dal bluetooth)
  userAllarmDeactivation: number; // secondi
  UserBluetoothPowerGeolocation: number; // threshold(Dipende dal bluetooth)

  geolocationRangeMessage = 'Indicare la frenquenza (in minuti) di invio della posizione al server.';
  bluetoothAllarmMessage = 'Indicare la soglia sotta la quale si attiva la seganalazione di pericolo';

  constructor(private toastController: ToastController) {}

  ngOnInit() {
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
}
