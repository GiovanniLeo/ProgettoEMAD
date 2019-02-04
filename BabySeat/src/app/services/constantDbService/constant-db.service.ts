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
  IP_ADR_PORT = 'http://localhost:8080/Server'; // 'http://192.168.1.106:8080/Server';

}
