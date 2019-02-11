import { Component, OnInit } from '@angular/core';
import {IonicSelectableComponent} from 'ionic-selectable';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.page.html',
  styleUrls: ['./select-user.page.scss'],
})
export class SelectUserPage implements OnInit {

  users = [];
  usersSelected = null;

  constructor(private firestore: AngularFirestore) {

    this.users = [
      {id: 1, name: 'Ignazio'},
      {id: 2, name: 'Michele'},
      {id: 3, name: 'Fabbricio'},
      {id: 4, name: 'Giannalfonso'},
      {id: 5, name: 'DottoreMatt'},
    ];
  }

  ngOnInit() {
  }

  userChange(event: {component: IonicSelectableComponent, value: any}) {
    console.log('even', event);
  }


}
