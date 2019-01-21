import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SigninPage } from './signin.page';
import {IonicSelectableModule} from 'ionic-selectable';
import {NO_ERRORS_SCHEMA} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: SigninPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule
  ],
  declarations: [SigninPage],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SigninPageModule {}
