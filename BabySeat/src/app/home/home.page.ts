import {Component, OnInit} from '@angular/core';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {ConstantDbService} from '../services/constantDbService/constant-db.service';
import {Router, RouterEvent} from '@angular/router';
import {delay, filter} from 'rxjs/operators';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {AuthService} from '../services/authService/autb-service.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import {BleService} from '../services/bleService/ble.service';
import {GeolocationService} from '../services/geolocationService/geolocation.service';




@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    threshold = 2;
    danger = false;
    timer: number;
    value: number;
    stopProgres = false;
    isAutista = false;
    isAngelo = false;


    constructor(private localNotification: LocalNotifications, private  platform: Platform, private storage: Storage,
                private constDb:  ConstantDbService, private router: Router, private backMode: BackgroundMode,
                private authService: AuthService,
                private auth: AngularFireAuth,
                private firestore: AngularFirestore,
                private http: HttpClient,
                private bleSer: BleService,
                private geolocationService: GeolocationService) {

        if (constDb.USER_OBJ !== null) {
console.log(constDb.USER_OBJ);
            this.checkRole(JSON.parse(constDb.USER_OBJ).ruolo);
        } else {
            router.navigate(['/login']);
        }
            /*
        this.auth.authState.subscribe(user => {
            if (!user) {
                router.navigate(['/login']);
            } else {
                if (this.userObj === null) {
                    console.log(user.uid);
                    // getting the user info, if it's logged
                    this.firestore.doc<any>('users/' + user.uid).get().subscribe(userObj => {
                        const userJson = {
                            uid: user.uid,
                            nome: userObj.get('nome'),
                            cognome: userObj.get('cognome'),
                            email: userObj.get('email'),
                            ruolo: userObj.get('ruolo'),
                        };

                        this.checkRole(userJson.ruolo);

                        // useful to save the JSON stringified, so that the method will wait that all the variables are setted
                        // in this way, before using the fields it should be parsed with JSON.parse()
                        this.userObj = JSON.stringify(userJson);
                        console.log(userObj);
                    }, error => {
                        this.userObj = null;
                    });
                }
            }
        }, (error) => {
            console.log(error.message);
            this.router.navigate(['/login']);
        });

*/
        this.platform.ready().then((rdy) => {
            this.checkThreshold(this.threshold);
            // this.bleSer.checkBluetoothSignal();
            // t his.getRole();
        });

        // Quando si indietro o vanti utilizzzando il routing di angual viene aggiornato il timer
        router.events.pipe(
            filter(e => e instanceof RouterEvent)
        ).subscribe(e => {
            this.instialState();
        });
        this.value = 0.0;
    }

    ngOnInit(): void {
        this.instialState();
    }

    sendNotification(type: string) {

        console.log(this.constDb.USER_OBJ);
        if (this.constDb.USER_OBJ !== null) {
            const userJson = JSON.parse(this.constDb.USER_OBJ);

            // getting the token device of the user, and sending via http to cloud function for sending a cloud message to the device
            const device = this.firestore.doc<any>('devices/' + userJson.uid).get();

            // querying the user for the token, parsing to JSON and sending via post
            device.subscribe(tokenUser => {
                const obj = {
                    token: tokenUser.get('token'),
                    nome: userJson.nome,
                    cognome: userJson.cognome
                };

                const jsonToken = JSON.stringify(obj);

                console.log(jsonToken);
                this.http.post('https://us-central1-babysafeseat-6b42d.cloudfunctions.net/sendNotificationToAngels', jsonToken)
                    .subscribe((data) => {
                        console.log('Notification sended, response: ' + data.toString());
                    }, error => {
                        console.log(error.message);
                    });
            }, error => {
                console.log(error.message);
            });
        } else {
            console.log('Cannot send notification');
        }

    }




    checkThreshold(threshold: number): void {
        if (threshold <= 3) {
            console.log('Check');
            document.getElementById('send').click();
        }
    }


    instialState() {

        this.storage.get(this.constDb.ALLARM_DEACT).then((val) => {
            if (val !== null && val !== undefined) {
                this.timer = val;
                console.log(this.timer);
            } else {
                this.timer = 60;
                console.log(this.timer);
            }
        });
    }

    startProgresBar() {
        const progres = (100 / this.timer) / 100;
        const intervalId = setInterval(() => {
            if (this.value <= 1 && !this.stopProgres &&  this.danger === true) {
                this.value = this.value + progres;
            } else {
                clearInterval(intervalId);
            }
        }, 1000);

    }

    stopProgress() {
        this.stopProgres = true;
        this.value = 0;
        this.danger = false;
    }

    logout() {
        this.constDb.USER_OBJ = null;
        this.authService.logoutUser();
    }

    checkRole(role: string) {
        console.log(role + '-----');
        if (role === this.constDb.AUTISTA ) {
            this.isAutista = true;
            this.isAngelo = false;
            this.geolocationService.getPositionOnDevice();
            this.geolocationService.getBackGroundPosition(role);
        } else {
            this.isAngelo = true;
            this.isAutista = false;
        }
    }


}
