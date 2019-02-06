import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrationSuccesPage } from './registration-succes.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationSuccesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistrationSuccesPage]
})
export class RegistrationSuccesPageModule {}
