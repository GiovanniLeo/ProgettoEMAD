import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicSelectableComponent} from 'ionic-selectable';
import {CityService} from '../services/cityService/city.service';
import {City} from '../classes/City';
import {Platform, ToastController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {ConstantDbService} from '../services/constantDbService/constant-db.service';
import {Router} from '@angular/router';

import {AuthService} from '../services/authService/autb-service.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {FcmService} from '../services/fcmService/fcm.service';
import {ToastService} from '../services/toastService/toast.service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

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

    constructor(private cityService: CityService, private platform: Platform, private form: FormBuilder,
                private http: HttpClient, private constDb: ConstantDbService,
                private auth: AuthService, private router: Router, private dialogs: Dialogs, private firestore: AngularFirestore,
                private localNotification: LocalNotifications,
                private fcm: FcmService) {
        this.regForm = form.group({
            nome: ['', Validators.required],
            cognome: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.min(6)])],
            confermap: ['', Validators.compose([Validators.required, Validators.min(6)])],
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
        const nome = this.regForm.value.nome;
        const cognome = this.regForm.value.cognome;
        const password = this.regForm.value.password;
        const confermaPassword = this.regForm.value.confermap;
        const email = this.regForm.value.email;
        const citta = this.regForm.value.citta;
        const ruolo = this.regForm.value.ruolo === '0' ? 'Au' : 'An';



        if (nome === null || cognome === null || password === null ||
            confermaPassword === null || email === null || citta === null ||
            ruolo === null) {
            this.showError = true;
            return;
        } else if (password.length < 6) {
            this.showError = true;
            return;
        } else if (password !== confermaPassword) {
            this.showError = true;
            return;
        } else {
            console.log('Tutto secondo i piani');
            this.auth.signupUser(this.regForm.value.email, this.regForm.value.password).then(
                authData => {
                    // adding to firestore using the uid
                    const users = this.firestore.doc('users/' + authData.user.uid).set({
                        'uid': authData.user.uid,
                        'nome': nome,
                        'cognome': cognome,
                        'email': email,
                        'password': password,
                        'ruolo': ruolo,
                        'citta': citta
                    });

                    const userJson = {
                        uid: authData.user.uid,
                        nome: nome,
                        cognome: cognome,
                        email: email,
                        ruolo: ruolo,
                    };

                    // Save city cords to local db
                    this.constDb.lat = this.city.lat;
                    this.constDb.long = this.city.lng;


                    // useful to save the JSON stringified, so that the method will wait that all the variables are setted
                    // in this way, before using the fields it should be parsed with JSON.parse()
                    this.constDb.USER_OBJ = JSON.stringify(userJson);
                    console.log(this.constDb.USER_OBJ);

                    this.notificationSetup();
                    this.showError = false;
                    this.router.navigate(['/registration-succes']);
                }
                , (error) => {
                    console.log(error.message);
                    this.showError = true;

                });

        }
    }

    // listen for notification
    notificationSetup() {
        this.fcm.getToken();
        // aprire mappa con coordinate

        this.fcm.listenToNotifications().subscribe(
            (msg) => {
                console.log('notification: ' + msg);
                // deve aprirsi la mappa e settarsi le coordinate inviate, se la notifica è quella di bambino dimenticato
                // da autista ad angelo.. se invece la notifica è per allontanamento bluetooth, deve partire la progress e aprirsi la home
                // se invece un nuovo angelo si è associato, o hai associato un nuovo utente, si apre qualcosa..
                if (this.platform.is('ios')) {
                    this.localNotification.schedule({
                        id: 1,
                        title: 'Notification received',
                        text: msg.aps.alert,
                        sound: 'file://sound.mp3'
                    });
                } else {
                    this.localNotification.schedule({
                        id: 1,
                        title: 'Notification received',
                        text: msg.body,
                        sound: 'file://beep.caf'
                    });
                }

            });


    }

}
