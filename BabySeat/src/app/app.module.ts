import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import {HttpClientModule} from '@angular/common/http';
import {BLE} from '@ionic-native/ble/ngx';

import {Firebase} from '@ionic-native/firebase/ngx';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';

import { AuthService } from './services/authService/autb-service.service';

import { Dialogs } from '@ionic-native/dialogs/ngx';
import {AngularFireDatabaseModule} from '@angular/fire/database';

const firebaseConfig = {
    apiKey: 'AIzaSyAIuPrsm12hFk7aeLdDtiy6C8hA0L4O5zc',
    authDomain: 'babysafeseat-6b42d.firebaseapp.com',
    databaseURL: 'https://babysafeseat-6b42d.firebaseio.com',
    projectId: 'babysafeseat-6b42d',
    storageBucket: 'babysafeseat-6b42d.appspot.com',
    messagingSenderId: '324381377216'
};


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfig), HttpClientModule, AngularFirestoreModule, AngularFireDatabaseModule],

    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        AndroidPermissions,
        Geolocation,
        BackgroundMode,
        Diagnostic,
        LocalNotifications,
        LocationAccuracy,
        Clipboard,
        BLE,
        Firebase,
        AngularFireAuth,
        AuthService,
        AngularFirestoreModule,
        Dialogs
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}

