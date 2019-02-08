import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SigninPage } from './signin.page';
import { HttpClientModule } from '@angular/common/http';
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
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule,
  ],
  declarations: [SigninPage],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SigninPageModule {}
