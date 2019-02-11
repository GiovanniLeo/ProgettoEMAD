import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Router} from '@angular/router';
import {Platform, ToastController} from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {PermissionService} from '../services/permissionService/permission.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../services/toastService/toast.service';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/authService/autb-service.service';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {GeolocationService} from '../services/geolocationService/geolocation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  logForm: FormGroup;
  lat; long;
  response: String;
  loginSucces = false;
  showError = false;
  unespectedError = false;
  webFlag = true;

  constructor(private geolocation: Geolocation, private router: Router, private toastController: ToastService,
              private backGround: BackgroundMode, private platform: Platform,
              private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy,
              private androidPermissions: AndroidPermissions,
              private permissionService: PermissionService,
              private fb: FormBuilder,
              private http: HttpClient,
              private auth: AuthService,
              private geolocationService: GeolocationService) {
    this.logForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }



  ngOnInit() {
    if (this.webFlag) {
      this.getPositionOnWeb(false);
    }
    this.platform.ready().then((rdy) => {
      this.permissionService.requestGPSpermission();
      this.geolocationService.getPositionOnDevice(false);
    });
  }

  checkLogin() {

    if (this.webFlag) {
      this.getPositionOnWeb(false);
    }
    this.geolocationService.getPositionOnDevice(true);

    this.auth.loginUser(this.logForm.value.email, this.logForm.value.password)
        .then(
        authData => {
          this.unespectedError = false;
          this.router.navigate(['/home']);
        },
        (error) => {
          this.showError = true;
          this.unespectedError = true;
        });
   }




  getPositionOnWeb(navigate: boolean) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      console.log(resp.coords.latitude + ' ' + resp.coords.longitude);
      console.log('else loc');
      if (navigate === true) {
        this.router.navigate(['/home']);
      }
    }).catch((error) => {
      console.log('Error getting location', error);
      this.toastController.presentToastWithOptions('Errore nell\' ottenimento della poaizione, perfavore riprova');
    });
  }

}
