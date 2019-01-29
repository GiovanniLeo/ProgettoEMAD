import { Injectable } from '@angular/core';
import {Firebase} from '@ionic-native/firebase/ngx';
import {AngularFirestore} from '@angular/fire/firestore';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
      private firebaseNative: Firebase,
      private afs: AngularFirestore,
      private platform: Platform
  ) { }


  // Get permission from the user
  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    if (this.platform.is('cordova')) {
      token = await this.firebaseNative.getToken();
    }

    return this.saveTokenToFirestore(token);
  }

// Save the token to firestore
  private saveTokenToFirestore(token) {
    if (!token) { return; }

    const devicesRef = this.afs.collection('devices');

    const docData = {
      token,
      userId: 'testUser',
    };

    return devicesRef.doc(token).set(docData);
  }

// Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }
}
