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
import {BleService} from '../services/bleService/ble.service';
import * as admin from 'firebase-admin';




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
    role;
    isAutista = false;
    isAngelo = false;


    constructor(private localNotification: LocalNotifications, private  platform: Platform, private storage: Storage,
                private constDb:  ConstantDbService, private router: Router, private backMode: BackgroundMode,
                private authService: AuthService,
                private auth: AngularFireAuth,
                private bleSer: BleService,
                private firestore: AngularFirestore) {

        this.auth.authState.subscribe(user => {
            if (!user) {
                this.router.navigate(['/login']);
            }
        }, (error) => {
            console.log(error.message);
            this.router.navigate(['/login']);
        });


        this.platform.ready().then((rdy) => {
            this.localNotification.on('click');
            this.checkThreshold(this.threshold);
            this.bleSer.checkBluetoothSignal();
        });

        // Quando si indietro o vanti utilizzzando il routing di angual viene aggiornato il timer
        router.events.pipe(
            filter(e => e instanceof RouterEvent)
        ).subscribe(e => {
            this.instialState();
        });
        this.value = 0.0;

        if (this.backMode.isEnabled()) {
            this.sendNotification('BackMode');
        }
    }

    ngOnInit(): void {
        this.instialState();
        console.log('Init');
        this.getRole();
        // this.checkRole(this.role);
    }

    getRole() {
        this.auth.authState.subscribe(user => {
            if (user) {
                console.log('uid: ' + user.uid);
                const userDoc = this.firestore.doc<any>('users/' + user.uid).get();
                userDoc.subscribe( us => {
                    const role = us.get('ruolo');
                    console.log(role);
                    return role;
                }, error1 => {
                    console.log(error1.message);
                });
            }
        });
    }


    sendNotification(message: string) {

        this.auth.authState.subscribe(user => {
            if (user) {
                // Notification content
                const payload = {
                    notification: {
                        title: 'Ciao!',
                        body: `Bell!`,
                        icon: 'https://goo.gl/Fz9nrQ'
                    }
                };

                const device = this.firestore.doc<any>('devices/' + user.uid).get();
                device.subscribe(tokenUser => {
                    const token = tokenUser.get('token');
                }, error => {
                    console.log(error.message);
                });
            } else {
                console.log('Cannot send notification');
            }
        }, (error) => {
            console.log(error.message);
        });




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
        this.authService.logoutUser();
    }

    getRole() {
        this.auth.authState.subscribe(user => {
            if (user) {
                console.log(user.uid);
                const userDoc = this.firestore.doc<any>('users/' + '15ucc8DiMd9uXSg4NIjp').get();
                // console.log(user.uid);
                userDoc.subscribe( us => {
                    // console.log(us);
                    const role = us.get('ruolo');
                    this.checkRole(role);
                });
            }
        });
    }

    checkRole(role: String) {
        console.log(role + '-----');
        if (role === this.constDb.AUTISTA ) {
            this.isAutista = true;
        } else {
            this.isAngelo = true;
        }
    }


}
