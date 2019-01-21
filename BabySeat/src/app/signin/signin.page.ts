import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  city = '';

  cities = [
      {id: 1, city: 'Salerno'},
      {id: 2, city: 'Bologna'},
      {id: 3, city: 'Sarno'},
      {id: 4, city: 'Siano'},
      {id: 5, city: 'Fisciano'}
  ];

  constructor() { }

  ngOnInit() {
  }

  cityChanges(event: {component: IonicSelectableComponent, value: any}) {
    console.log('even', event);
  }

}
