import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Router} from '@angular/router';
import {Platform, ToastController} from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  webFlag = true;

  constructor(private geolocation: Geolocation, private router: Router, private toastController: ToastController,
              private backGround: BackgroundMode, private platform: Platform,
              private diagnostic: Diagnostic) { }

  ngOnInit() {
    if (this.webFlag) {
      this.getPositionOnWeb(false);
    }
    this.platform.ready().then((rdy) => {

      this.diagnostic.getLocationMode().then((state) => {
        if (state === this.diagnostic.locationMode.LOCATION_OFF) {
          this.presentToastWithOptions('Attiva la geolocalizzazione');
        } else {
          this.geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude
            console.log(resp.coords.latitude + ' ' + resp.coords.longitude);
            console.log('else loc');

          }).catch((error) => {
            console.log('Error getting location', error);
            this.presentToastWithOptions('Errore nell\' ottenimento della poaizione, perfavore riprova');
          });
        }
      }).catch(e => {
        console.log('error ' + e);
      });
    });
    // this.backGround.enable();
  }

  login() {
    if (this.webFlag) {
       this.getPositionOnWeb(true);
    }


    this.diagnostic.getLocationMode().then((state) => {
      if (state === this.diagnostic.locationMode.LOCATION_OFF) {
        this.presentToastWithOptions('Attiva la geolocalizzazione');
      } else {
        this.geolocation.getCurrentPosition().then((resp) => {
          // resp.coords.latitude
          // resp.coords.longitude
          console.log(resp.coords.latitude + ' ' + resp.coords.longitude);
          console.log('else loc');
          this.router.navigate(['/home']);

        }).catch((error) => {
          console.log('Error getting location', error);
          this.presentToastWithOptions('Errore nell\' ottenimento della poaizione, perfavore riprova');
        });
      }
    }).catch(e => {
      console.log('error ' + e);
    });
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


}
