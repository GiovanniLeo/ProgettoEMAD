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
import {ConstantDbService} from '../services/constantDbService/constant-db.service';
import { HttpHeaders } from '@angular/common/http';



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


  constructor(private geolocation: Geolocation, private router: Router, private toastController: ToastService,
              private backGround: BackgroundMode, private platform: Platform,
              private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy,
              private androidPermissions: AndroidPermissions,
              private permissionService: PermissionService,
              private fb: FormBuilder,
              private http: HttpClient,
              private constDB: ConstantDbService) {}


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

    const valueToSubmit = {
      email: this.getEmail(),
      password: this.getPassword() /*,
      latitude: this.lat,
      longitude: this.long*/
    };

    const url = this.constDB.IP_ADR_PORT + 'Login';

    this.http.post(url, valueToSubmit, {}).subscribe(
        data => {
          // this.response = JSON.stringify(data);
          console.log('Response');
          console.log(data);

        }, error => {
          console.log(error.status);
          console.log(error.error);
          console.log(error.headers);
        });
    console.log(valueToSubmit);

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

  getEmail() {
    return this.loginForm.get('email').value;
  }

  getPassword() {
    return this.loginForm.get('password').value;
  }



}
