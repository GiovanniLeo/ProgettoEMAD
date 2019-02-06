import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicSelectableComponent} from 'ionic-selectable';
import {CityService} from '../services/cityService/city.service';
import {City} from '../classes/City';
import {Platform} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {ConstantDbService} from '../services/constantDbService/constant-db.service';
import {Router} from '@angular/router';

import {AuthService} from '../services/authService/autb-service.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.page.html',
    styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
    city: City;
    cities: City[];
    formReg: FormGroup;
    passwordWrong = false;
    registrationSucces = false;
    showError = false;
    response: String;

    constructor(private cityService: CityService, private platform: Platform, private form: FormBuilder,
                private http: HttpClient, private constDB: ConstantDbService,
                private auth: AuthService, private router: Router) {
        this.formReg = form.group({
            nome: ['', Validators.required],
            cognome: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            confermap: ['', Validators.required],
            ruolo: ['', Validators.required],
            citta: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.platform.ready().then((rdy) => {
            this.getCities();
        });

    }

    cityChanges(event: {component: IonicSelectableComponent, value: any}) {
        console.log('even', event);
        console.log(this.city);
    }

    getCities() {
        this.cityService.getData().subscribe((data) => {
            this.cities = data;
        });
    }

    checkRegistrazione() {
        /*

            console.log(valueToSubmit);
            this.http.post(url, valueToSubmit, {})
                .subscribe(data => {
                    this.response = data;
                    this.registrationSucces = this.response.added[0];
                    if (this.registrationSucces === true) {
                        this.showError = false;
                        this.router.navigate(['/registration-succes']);
                    } else {
                        this.showError = true;
                    }
                }, error => {
                    this.showError = true;
                    console.log(error.status);
                    console.log(error.error);
                    console.log(error.headers);
                });
        }
           });

*/
        if (this.formReg.value.password !== this.formReg.value.confermap) {
            this.passwordWrong = true;
        } else {
            this.passwordWrong = false;
            this.auth.signupUser(this.formReg.value.email, this.formReg.value.password)
                .then(
                    authData => {
                        console.log('Added');
                    },
                    (error) => {
                        console.log(error.message);
                    });
        }
    }
}
