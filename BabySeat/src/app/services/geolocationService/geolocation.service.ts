import {Injectable, NgZone} from '@angular/core';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {ToastService} from '../toastService/toast.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {ConstantDbService} from '../constantDbService/constant-db.service';
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  lat; long; geolocationTimer;
  constructor(private diagnostic: Diagnostic,
              private firestore: AngularFirestore,
              private auth: AngularFireAuth,
              private locationAccuracy: LocationAccuracy,
              private geolocation: Geolocation,
              private toastController: ToastService,
              private ngZone: NgZone,
              private constDb: ConstantDbService,
              private storage: Storage) {
  }

  getPositionOnDevice(updateDb: boolean) {
    this.diagnostic.getLocationMode().then((state) => {
      if (state === this.diagnostic.locationMode.LOCATION_OFF) {
        this.requestPositionAttivation();
      } else {
        this.geolocation.getCurrentPosition().then((resp) => {
          this.lat = resp.coords.latitude;
          this.long = resp.coords.longitude;

          if (updateDb === true) {
            this.updateGeolocationOnDb();
          }

          console.log(resp.coords.latitude + ' ' + resp.coords.longitude);
          console.log('else loc');
        }).catch((error) => {
          console.log('Error getting location', error);
          this.toastController.presentToastWithOptions('Errore nell\' ottenimento della poaizione, perfavore riprova');
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

  updateGeolocationOnDb() {
    this.auth.authState.subscribe(user => {
      if (user) {
        console.log('uid: ' + user.uid);
        const userDoc = this.firestore.doc<any>('users/' + user.uid).update( {
          citta: {
            lat: this.lat,
            lng: this.long
          }
        });
      }
    });
  }

  getBackGroundPosition(role: string) {
    this.geolocationTimer = 60 * 1000;
    this.ngZone.run(() => {
      const intervalId = setInterval(() => {
        if (role === this.constDb.AUTISTA) {
          this.checkTimer();
          this.geolocationTimer = this.geolocationTimer * 1000;
          console.log('pos back');
          this.getPositionOnDevice(true);
        } else {
          clearInterval(intervalId);
        }
      }, this.geolocationTimer);
    });
  }

  checkTimer() {
    this.storage.get(this.constDb.GEO_RANGE).then((val) => {
      if (val !== null && val !== undefined) {
        this.geolocationTimer = val;
      } else {
        this.geolocationTimer = this.constDb.minGeolocationRange;
      }
    });
  }

}
