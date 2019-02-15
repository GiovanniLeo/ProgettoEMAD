import {Component, NgZone, OnInit} from '@angular/core';
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
import {FcmService} from '../services/fcmService/fcm.service';




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
    loggedUser;


    constructor(private localNotification: LocalNotifications, private  platform: Platform, private storage: Storage,
                private constDb:  ConstantDbService, private router: Router, private backMode: BackgroundMode,
                private authService: AuthService,
                private auth: AngularFireAuth,
                private firestore: AngularFirestore,
                private http: HttpClient,
                private bleSer: BleService,
                private geolocationService: GeolocationService,
                private fcm: FcmService,
                private ngZone: NgZone) {

        this.instialState();
        this.checkLogin();
        this.notificationSetup();

        this.platform.ready().then((rdy) => {
            // this.checkThreshold(this.threshold);
            this.bleSer.checkBluetoothSignal();
            this.getRole();
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
        this.getRole();
    }

    checkThreshold(threshold: number): void {
        if (threshold <= 3) {
            // console.log('Check');
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
        this.ngZone.run(() => {
            this.danger = true;
            this.sendNotificationToAngels();
            const progres = (100 / this.timer) / 100;
            const intervalId = setInterval(() => {
                if (this.value <= 1 && !this.stopProgres &&  this.danger === true) {
                    this.value = this.value + progres;
                } else {
                    clearInterval(intervalId);
                    this.sendNotificationToAngels();
                    this.sendLocalNotificatio();
                    this.stopProgress();
                    this.value = 0;
                }
            }, 1000);
        });
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

    getRole() {
        this.auth.authState.subscribe(user => {
            if (user) {
                console.log('uid: ' + user.uid);
                const userDoc = this.firestore.doc<any>('users/' + user.uid).get();
                // console.log(user.uid);
                userDoc.subscribe( us => {
                    // console.log(us);
                    const role = us.get('ruolo');
                    this.checkRole(role);
                } , error1 => {
                    console.log(error1.message);
                });
            }
        });
    }

    checkRole(role: string) {
        console.log(role + '-----');
        if (role === this.constDb.AUTISTA ) {
            this.isAutista = true;
            this.isAngelo = false;
            console.log(this.isAutista + '---->' + 'Autista' );
            // @ts-ignore
            this.geolocationService.getPositionOnDevice(true);
            this.bleSer.checkBluetoothSignalForPosition(role);
            // this.geolocationService.getBackGroundPosition(role);
        } else {
            this.isAngelo = true;
            this.isAutista = false;
        }
    }

    sendNotificationToAngels() {

        if (this.constDb.USER_OBJ !== null) {
            const userJson = JSON.parse(this.constDb.USER_OBJ);
            const obj = {
                uid: userJson.uid,
                nome: userJson.nome,
                cognome: userJson.cognome,
                lat: this.constDb.lat,
                long: this.constDb.long
            };
            const jsonUser = JSON.stringify(obj);

            console.log('jsonuser in home.page: ' + jsonUser);
            this.http.post('https://us-central1-babysafeseat-6b42d.cloudfunctions.net/sendNotificationToAngels', jsonUser)
                .subscribe((data) => {
                    console.log('Notification to angels sended, response: ' + data.toString());
                }, error => {
                    console.log(error.message);
                });

        } else {
            console.log('Cannot send notification');
        }

    }

    checkLogin() {
        this.auth.authState.subscribe(user => {

            if (!user) {
                this.constDb.USER_OBJ = null;
            } else {
                // getting the user info, if it's logged
                this.firestore.doc<any>('users/' + user.uid).get().subscribe(userObj => {
                    this.checkRole(userObj.get('ruolo'));
                    const userJson = {
                        uid: user.uid,
                        nome: userObj.get('nome'),
                        cognome: userObj.get('cognome'),
                        email: userObj.get('email'),
                        ruolo: userObj.get('ruolo'),
                    };

                    // useful to save the JSON stringified, so that the method will wait that all the variables are setted
                    // in this way, before using the fields it should be parsed with JSON.parse()
                    this.constDb.USER_OBJ = JSON.stringify(userJson);
                    console.log(this.constDb.USER_OBJ);
                }, error1 => {
                    this.constDb.USER_OBJ = null;
                    this.router.navigate(['/login']);
                });
            }

        }, err => {
            this.constDb.USER_OBJ = null;
            this.router.navigate(['/login']);
        });

    }

    // listen for notification
    notificationSetup() {
        this.fcm.getToken();
        // aprire mappa con coordinate

        this.fcm.listenToNotifications().subscribe(
            (msg) => {
                let title = 'Notification received';

                console.log('todo: -> ' + msg.title);
                if (msg.title.startsWith('angels')) {
                    title = 'Hey! Qualcuno sta dimenticando un bambino!';
                } else if (msg.title === 'autista') {
                    title = ' Hey! Torna in auto a prendi il bambino!';
                }

                // deve aprirsi la mappa e settarsi le coordinate inviate, se la notifica è quella di bambino dimenticato
                // da autista ad angelo.. se invece la notifica è per allontanamento bluetooth, deve partire la progress e aprirsi la home
                // se invece un nuovo angelo si è associato, o hai associato un nuovo utente, si apre qualcosa..
                if (this.platform.is('ios')) {
                    this.localNotification.schedule({
                        title: title,
                        text: msg.aps.alert,
                        sound: 'file://sound.mp3'
                    });
                } else {
                    this.localNotification.schedule({
                        title: title,
                        text: msg.body,
                        sound: 'file://beep.caf'
                    });
                }

                if (msg.title === 'angels' && this.constDb.USER_OBJ.ruolo === this.constDb.ANGELO) {
                    console.log('apri mappa con coordinate');
                    const mes = msg.title.split(':');

                    this.constDb.lat = mes[1];
                    this.constDb.long = mes[2];

                    console.log('lat-> ' + this.constDb.lat + ' , long -> ' + this.constDb.long);
                    this.router.navigate(['/map-view']);
                } else if (msg.title === 'autista') {
                    console.log('Children need help!');
                    this.router.navigate(['/home']);
                    this.startProgresBar();
                } else if (msg.title === 'help') {
                    console.log('user added');
                }


            });


    }
    sendLocalNotificatio() {
        const text = 'Hey, sono stati avvisati gli angeli!';
         this.localNotification.schedule(
            {
                id: 1,
                title: text,
            }
        );
    }
    enableBluetooth() {
        this.bleSer.enableBle();
    }

}
