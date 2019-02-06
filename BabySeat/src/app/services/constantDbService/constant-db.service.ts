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
  IP_ADR_PORT = 'http://192.168.43.39:8080/BabySafeSeatServer'; // 'http://192.168.1.106:8080/Server';
}
