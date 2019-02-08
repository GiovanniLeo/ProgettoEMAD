import { Injectable } from '@angular/core';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor( private androidPermissions: AndroidPermissions) { }

  requestGPSpermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        result => {
          console.log('Has permission?', result.hasPermission);
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
    );
  }

  requestBluetoothPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN).then(
        result => {
          console.log('Has permission?', result.hasPermission);
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN);
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN)
    );

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH).then(
        result => {
          console.log('Has permission?', result.hasPermission);
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH);
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.BLUETOOTH)
    );


  }
}
