import { Component, OnInit } from '@angular/core';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.page.html',
  styleUrls: ['./select-user.page.scss'],
})
export class SelectUserPage implements OnInit {

  users = [
    {id: 1, name: 'Ignazio'},
    {id: 2, name: 'Michele'},
    {id: 3, name: 'Fabbricio'},
    {id: 4, name: 'Giannalfonso'},
    {id: 5, name: 'DottoreMatt'},
  ];
  usersSelected = null;
  constructor() { }

  ngOnInit() {
  }

  userChange(event: {component: IonicSelectableComponent, value: any}) {
    console.log('even', event);
  }


}
