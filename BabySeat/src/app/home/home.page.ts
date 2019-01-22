import { Component } from '@angular/core';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Platform, Events} from '@ionic/angular';



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    threshold = 2;

    constructor(private localNotification: LocalNotifications, private  platform: Platform, private evets: Events) {
        this.platform.ready().then((rdy) => {
            this.localNotification.on('click');
        });
    }

    sendNotification() {
        this.localNotification.schedule(
            {
                id: 1,
                title: 'Te scudat o\' criatur!!!',
            }
        );
    }

}
