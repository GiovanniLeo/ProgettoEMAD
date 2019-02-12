import { Injectable } from '@angular/core';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Platform} from '@ionic/angular';
import {FcmService} from '../fcmService/fcm.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantDbService {

  constructor(private localNotification: LocalNotifications,
              private platform: Platform,
              private fcm: FcmService) { }

  GEO_RANGE = 'userGeolocation';
  BLU_ALLARM = 'userBluetoothAllarm';
  ALLARM_DEACT = 'userAllarmDeactivation';
  BLUE_GEO = 'UserBluetoothPowerGeolocation';
  BLE_DEVICE = 'Id ble';
  AUTISTA = 'Au';
  ANGELO = 'An';
  minGeolocationRange = 1; // minuti
  minBluetoothAllarm = -74; // threshold(Dipende dal bluetooth)
  minRangeAllarmDeactivation = 30; // secondi
  minBluetoothPowerGeolocation =  -74; // soglia bluetooth
  USER_OBJ = null;
  lat = 0 ;
  long = 0;

  // listen for notification
  notificationSetup() {
    this.fcm.getToken();
    // aprire mappa con coordinate

    this.fcm.listenToNotifications().subscribe(
        (msg) => {
          console.log('notification-> id: ' + msg.id + ' lat: ' + msg.lat + ' long: ' + msg.long);
          // deve aprirsi la mappa e settarsi le coordinate inviate, se la notifica è quella di bambino dimenticato
          // da autista ad angelo.. se invece la notifica è per allontanamento bluetooth, deve partire la progress e aprirsi la home
          // se invece un nuovo angelo si è associato, o hai associato un nuovo utente, si apre qualcosa..
          if (this.platform.is('ios')) {
            this.localNotification.schedule({
              title: 'Notification received',
              text: msg.aps.alert,
              sound: 'file://sound.mp3'
            });
          } else {
            this.localNotification.schedule({
              title: 'Notification received',
              text: msg.body,
              sound: 'file://beep.caf'
            });
          }

        });


  }
}
