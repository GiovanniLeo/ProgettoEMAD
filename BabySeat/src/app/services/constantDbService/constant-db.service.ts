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

}
