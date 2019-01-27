import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Router} from '@angular/router';
import {Platform, ToastController} from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  webFlag = false;

  constructor(private geolocation: Geolocation, private router: Router, private toastController: ToastController,
              private backGround: BackgroundMode, private platform: Platform,
              private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy,
              private androidPermissions: AndroidPermissions) { }

  ngOnInit() {
    if (this.webFlag) {
      this.getPositionOnWeb(false);
    }
    this.platform.ready().then((rdy) => {
      this.requestGPSpermission();
      this.getPositionOnDevice(false);
    });
    // this.backGround.enable();
  }

  login() {
    if (this.webFlag) {
      this.getPositionOnWeb(true);
    }
    this.getPositionOnDevice(true);
  }

  async presentToastWithOptions(message: string) {
    console.log(message);
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      position: 'middle',
      closeButtonText: 'Ok'
    });
    toast.present();
  }


  getPositionOnWeb(navigate: boolean) {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp.coords.latitude + ' ' + resp.coords.longitude);
      console.log('else loc');
      if (navigate === true) {
        this.router.navigate(['/home']);
      }
    }).catch((error) => {
      console.log('Error getting location', error);
      this.presentToastWithOptions('Errore nell\' ottenimento della poaizione, perfavore riprova');
    });
  }

  getPositionOnDevice(navigate: boolean) {
    this.diagnostic.getLocationMode().then((state) => {
      if (state === this.diagnostic.locationMode.LOCATION_OFF) {
        this.requestPositionAttivation();
        // this.presentToastWithOptions('Attiva la geolocalizzazione');
      } else {
        this.geolocation.getCurrentPosition().then((resp) => {
          // resp.coords.latitude
          // resp.coords.longitude
          console.log(resp.coords.latitude + ' ' + resp.coords.longitude);
          console.log('else loc');
          if (navigate === true) {
            this.router.navigate(['/home']);
          }

        }).catch((error) => {
          console.log('Error getting location', error);
          this.presentToastWithOptions('Errore nell\' ottenimento della poaizione, perfavore riprova');
        });
      }
    }).catch(e => {
      console.log('error ' + e);
    });
  }

  requestPositionAttivation() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => console.log('Request successful'),
            error => console.log('Error requesting location permissions', error)
        );
      }

    });
  }
  // Richiedo i pwermessi
  requestGPSpermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        result => {
          console.log('Has permission?', result.hasPermission);
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );
  }

}
