import { Injectable } from '@angular/core';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Platform} from '@ionic/angular';
import {FcmService} from '../fcmService/fcm.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantDbService {

  constructor(private localNotification: LocalNotifications,
              private platform: Platform) { }

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


}
