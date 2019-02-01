import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {City} from '../../classes/City';
import {Observable} from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) {
  }


  getData(): Observable<City[]> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return  this.http.get<City[]>('../../assets/Json/cityCoords.json', {headers: headers});
  }
}
