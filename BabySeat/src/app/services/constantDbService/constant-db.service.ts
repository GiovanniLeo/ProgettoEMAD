import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantDbService {

  constructor() { }

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
