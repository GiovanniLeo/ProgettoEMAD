import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Router} from '@angular/router';
import {Platform, ToastController} from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {PermissionService} from '../services/perssionService/permission.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../services/toastService/toast.service';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/authService/autb-service.service';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  webFlag = true;
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  lat; long;
  response;
  loginSucces = false;
  showError = false;
  unespectedError = false;


  constructor(private geolocation: Geolocation, private router: Router, private toastController: ToastService,
              private backGround: BackgroundMode, private platform: Platform,
              private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy,
              private androidPermissions: AndroidPermissions,
              private permissionService: PermissionService,
              private fb: FormBuilder,
              private http: HttpClient,
              private auth: AuthService,
              private dialogs: Dialogs) {}



  ngOnInit() {
    if (this.webFlag) {
      this.getPositionOnWeb(false);
    }
    this.platform.ready().then((rdy) => {
      this.permissionService.requestGPSpermission();
      this.getPositionOnDevice(false);
    });
    // this.backGround.enable();
    this.loginForm = this.fb.group({
      email: [this.email, [
        Validators.required,
        Validators.email
      ]],
      password: [this.password, [
        Validators.required
      ]]
    });
  }

  login() {

    if (this.webFlag) {
      this.getPositionOnWeb(false);
    }
    this.getPositionOnDevice(false);

    this.auth.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then(
        authData => {
          this.dialogs.alert('User logged!');
          this.unespectedError = false;
          this.router.navigate(['/home']);
        },
        (error) => {
          this.dialogs.alert(error.message);
          this.showError = true;
          this.unespectedError = true;
        });
    /*
    this.firebase.list('/users/').push({
      "nome": "marco"
    });
    */
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

  getPositionOnDevice(navigate: boolean) {
    this.diagnostic.getLocationMode().then((state) => {
      if (state === this.diagnostic.locationMode.LOCATION_OFF) {
        this.requestPositionAttivation();
      } else {
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

}
