import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicSelectableComponent} from 'ionic-selectable';
import {CityService} from '../services/cityService/city.service';
import {City} from '../classes/City';
import {Platform} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {ConstantDbService} from '../services/constantDbService/constant-db.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.page.html',
    styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
    city: City;
    cities: City[];
    formReg: FormGroup;
    response;
    nome: FormControl;
    cognome: FormControl;
    email: FormControl;
    password: FormControl;
    confermap: FormControl;
    citta: FormControl;
    ruolo: FormControl;
    passwordWrong = false;
    registrationSucces = false;
    showError = false;

    constructor(private cityService: CityService,
                private platform: Platform,
                private fb: FormBuilder,
                private http: HttpClient,
                private constDB: ConstantDbService,
                private router: Router) {}

    ngOnInit() {
        this.platform.ready().then((rdy) => {
            this.getCities();
        });

        this.formReg = this.fb.group({
            nome: [this.nome, [
                Validators.required,
            ]],
            cognome: [this.cognome, [
                Validators.required,
            ]],
            confermap: [this.confermap, [
                Validators.required,
            ]],
            ruolo: [this.ruolo, [
                Validators.required,
            ]],
            citta: [this.citta, [
                Validators.required,
            ]],
            email: [this.email, [
                Validators.required,
                Validators.email
            ]],
            password: [this.password, [
                Validators.required
            ]]
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
        if (this.getPassword() !== this.getConfermap()) {
            this.passwordWrong = true;
        } else {
            this.passwordWrong = false;
            const url = this.constDB.IP_ADR_PORT + '/Registrazione';

            const valueToSubmit = {
                nome: this.getNome(),
                cognome: this.getCognome(),
                ruolo: this.getRuolo(),
                password: this.getPassword(),
                citta: {
                    comune: this.city.comune,
                    lat: this.city.lat,
                    long: this.city.lng
                }
            };

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





    }

    getEmail() {
        return this.formReg.get('email').value;
    }

    getNome() {
        return this.formReg.get('nome').value;
    }

    getCognome() {
        return this.formReg.get('cognome').value;
    }

    getPassword() {
        return this.formReg.get('password').value;
    }

    getConfermap() {
        return this.formReg.get('confermap').value;
    }

    getRuolo() {
        return this.formReg.get('ruolo').value;
    }






}
