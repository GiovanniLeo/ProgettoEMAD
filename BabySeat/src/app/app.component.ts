import { Component } from '@angular/core';

import {Platform, ToastController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {tap} from 'rxjs/operators';
import {FcmService} from '../../services/fcmService/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private fcm: FcmService,
      private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notificationSetUp();
    });
  }

  notificationSetUp() {
    this.fcm.getToken();

    // Listen to incoming messages
    this.fcm.listenToNotifications().pipe(
        tap(msg => {
          // show a toast
          this.presentToast(msg.body);
        })
    )
        .subscribe();
  }

  private async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    toast.present();
  }
}
