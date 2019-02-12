import { Component, OnInit } from '@angular/core';
import {IonicSelectableComponent} from 'ionic-selectable';
import {AngularFirestore} from '@angular/fire/firestore';
import {ConstantDbService} from '../services/constantDbService/constant-db.service';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.page.html',
  styleUrls: ['./select-user.page.scss'],
})
export class SelectUserPage implements OnInit {

  users = [];
  usersSelected = null;

  constructor(private firestore: AngularFirestore,
              private constDb: ConstantDbService) {
    const coll = firestore.collection('users', ref => ref.where('ruolo', '==', 'Au')).valueChanges();
    coll.subscribe(angels => {
      this.users = angels;
    });
  }

  ngOnInit() {
  }

  userChange(event: {component: IonicSelectableComponent, value: any}) {
    console.log('even', event);
  }

  addUser() {
    const thisUid = JSON.parse(this.constDb.USER_OBJ).uid;
    const id = thisUid + this.usersSelected.uid;

    // for each user selected do ->

    this.firestore.doc('association/' + id).set({
      uidAutista: JSON.parse(this.constDb.USER_OBJ).uid,
      uidAngelo: this.usersSelected.uid
    });

  }

}
