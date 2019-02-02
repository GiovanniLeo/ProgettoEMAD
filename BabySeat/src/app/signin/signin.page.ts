import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicSelectableComponent} from 'ionic-selectable';
import {CityService} from '../services/cityService/city.service';
import {City} from '../classes/City';
import {Platform} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.page.html',
    styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
    city: City;
    cities: City[];
    formReg: FormGroup;
    response: String;

    constructor(private cityService: CityService, private platform: Platform, private form: FormBuilder, private http: HttpClient) {
        this.formReg = form.group({
            nome: ['', Validators.required],
            cognome: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            confermap: ['', Validators.required]
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
       // this.getPositionOnWeb(true);
       this.http.post('http://localhost:8080/BabySafeSeatServer/Registrazione', this.formReg.value, {})
           .subscribe(data => {
                this.response = JSON.stringify(data);
                console.log(this.response);
            }, error => {
               console.log(error.status);
               console.log(error.error);
               console.log(error.headers);
           });


    }
}
