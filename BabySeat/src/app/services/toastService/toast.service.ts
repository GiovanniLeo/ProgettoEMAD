import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async presentToastWithOptions(message: string) {
    console.log(message);
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Chiudi'
    });
    toast.present();
  }

  async presentToastTimeout(message, position) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: position
    });
    toast.present();
  }
}
