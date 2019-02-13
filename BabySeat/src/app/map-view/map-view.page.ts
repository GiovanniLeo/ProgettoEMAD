import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker, L, leaflet } from 'leaflet';
import {Platform} from '@ionic/angular';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import {ToastService} from '../services/toastService/toast.service';
import {ConstantDbService} from '../services/constantDbService/constant-db.service';




@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.page.html',
  styleUrls: ['./map-view.page.scss'],
})
export class MapViewPage implements OnInit {

  map: L.Map;
  lat: number;
  log: number;

  constructor(private platform: Platform,
              private clipboard: Clipboard,
              private toastService: ToastService,
              private constDb: ConstantDbService) {
    this.setCoordinates();
  }

  loadmap(lat: number, log: number) {
    setTimeout(() => {
      this.map = new Map('map').setView([lat, log], 8);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // tslint:disable-next-line
        maxZoom: 24
      }).addTo(this.map);
      // this.layer.marker([40.6642, 14.8046]).addTo(this.map);
      const marker2 = new marker([lat, log]).addTo(this.map);
    }, 50);
  }


  ngOnInit() {
    this.platform.ready().then((rdy) => {
      this.setCoordinates();
      this.loadmap(this.lat, this.log);
    });
  }

  setCoordinates() {
    this.lat = this.constDb.lat;
    this.log = this.constDb.long;
  }
  copyCoordsClipsboard() {
    const msgTocpy = this.lat + ' ' + this.log;
    this.clipboard.copy(msgTocpy + '');
    this.toastService.presentToastTimeout('Coordinate copiate', 'top');
    console.log('copy ok');
  }


}
