import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicSelectableComponent, IonicSelectableModule} from 'ionic-selectable';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  @ViewChild('citySelector') selectComponet: IonicSelectableComponent;
  city = '';

  cities = [
      'Salerno',
      'Nola',
      'Siano',
      'Fisciano'
  ];

  constructor() { }

  ngOnInit() {
  }

  /**cityChanges(event: {component: SelectSearchableComponent, value: any}) {
    console.log('even', event);
  }**/

}
