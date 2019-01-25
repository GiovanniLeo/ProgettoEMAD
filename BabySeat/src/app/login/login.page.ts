import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private geolocation: Geolocation, private router: Router, private toastController: ToastController) { }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp.coords.latitude + ' ' + resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
      this.presentToastWithOptions('Attiva la geolalizzazione');
    });
  }

  login() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp.coords.latitude + ' ' + resp.coords.longitude);
      this.router.navigate(['/home']);
    }).catch((error) => {
      console.log('Error getting location', error);
      this.presentToastWithOptions('Attiva la geolalizzazione');
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

}
