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



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    threshold = 2;
    danger = true;
    timer: number;
    value: number;
    stopProgres = false;


    constructor(private localNotification: LocalNotifications, private  platform: Platform, private storage: Storage,
                private constDb:  ConstantDbService, private router: Router, private backMode: BackgroundMode,
                private authService: AuthService,
                private auth: AngularFireAuth,
                private firestore: AngularFirestore,
                private http: HttpClient) {

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
                // getting the token device of the user, and sending via http to cloud function for sending a cloud message to the device
                const device = this.firestore.doc<any>('devices/' + user.uid).get();

                // querying the user for the token, parsing to JSON and sending via post
                device.subscribe(tokenUser => {
                    const objToken = {
                        token: tokenUser.get('token')
                    };

                    const jsonToken = JSON.stringify(objToken);

                    console.log(jsonToken);
                    this.http.post('https://us-central1-babysafeseat-6b42d.cloudfunctions.net/notification', jsonToken)
                        .subscribe((data) => {
                            console.log('Notification received, response: ' + data);
                        }, error => {
                            console.log(error.message);
                        });
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
}
