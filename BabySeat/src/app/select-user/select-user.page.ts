import { Component, OnInit } from '@angular/core';
import {IonicSelectableComponent} from 'ionic-selectable';
import {AngularFirestore} from '@angular/fire/firestore';
import {ConstantDbService} from '../services/constantDbService/constant-db.service';
import {Router} from '@angular/router';
import {forEach} from '@angular-devkit/schematics';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.page.html',
  styleUrls: ['./select-user.page.scss'],
})
export class SelectUserPage implements OnInit {

  users = [];
  usersSelected = [];

  constructor(private firestore: AngularFirestore,
              private constDb: ConstantDbService,
              private router: Router) {
    const coll = firestore.collection('users', ref => ref.where(
        'ruolo', '==', this.constDb.ANGELO
    )).valueChanges();

    coll.subscribe(angels => {
      this.users = angels;
    });
  }

  ngOnInit() {
  }

  userChange(event: {component: IonicSelectableComponent, value: any}) {
    console.log('even', event);
    console.log(this.usersSelected[0].uid);
  }

  addUser() {
    const thisUid = JSON.parse(this.constDb.USER_OBJ).uid;

    this.usersSelected.forEach( (user) => {
      const id = thisUid + user.uid;
      this.firestore.doc('association/' + id).set({
        uidAutista: JSON.parse(this.constDb.USER_OBJ).uid,
        uidAngelo: user.uid
      });
    });

    this.router.navigate(['/home']);

  }

}
