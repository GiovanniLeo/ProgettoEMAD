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
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.page.html',
    styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
    regForm: FormGroup;
    city: City;
    cities: City[];
    showError = false;
    response: String;
    users: AngularFirestoreCollection;

    constructor(private cityService: CityService, private platform: Platform, private form: FormBuilder,
                private http: HttpClient, private constDB: ConstantDbService,
                private auth: AuthService, private router: Router, private dialogs: Dialogs, private firestore: AngularFirestore) {
        this.regForm = form.group({
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
        if (this.registerUser()) {
            this.showError = false;
            this.router.navigate(['/registration-succes']);
        } else {
            this.showError = true;
        }

    }

    registerUser() {

        const nome = this.regForm.value.nome;
        const cognome = this.regForm.value.cognome;
        const password = this.regForm.value.password;
        const confermaPassword = this.regForm.value.confermap;
        const email = this.regForm.value.email;
        const citta = this.regForm.value.citta;
        const ruolo = this.regForm.value.ruolo === '0' ? 'Au' : 'An';

        if (password !== confermaPassword) {
            return false;
        }

        this.auth.signupUser(this.regForm.value.email, this.regForm.value.password).then(
            authData => {
                this.users = this.firestore.collection<any>('users');
                this.users.add({
                            'nome': nome,
                            'cognome': cognome,
                            'email': email,
                            'password': password,
                            'ruolo': ruolo,
                            'citta': citta
                            });
                },
            (error) => {
                        console.log(error.message);
                        return false;
                    });
        return true;
    }
}
