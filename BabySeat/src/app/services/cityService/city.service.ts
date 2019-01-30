import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {City} from '../../classes/City';
import {Observable} from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CityService implements OnInit {

  constructor(private http: HttpClient) {
    this.getData();
  }
  cities: City[];

  getData(): Observable<City[]> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    this.http.get<City[]>('../../assets/Json/cityCoords.json', {headers: headers})
        .subscribe((data) => {
          this.cities = data;
        });
    return  this.http.get<City[]>('../../assets/Json/cityCoords.json', {headers: headers});
  }

  sliceData(size: number, count: number): City[] {
    const start =  count * size;
    const stop = (count * size) + size;
    const slicedCities = this.cities.slice(start, stop);
    console.log(slicedCities);
    return slicedCities;
  }

  getAsyncCities(size?: number, count?: number, timeout?: number): Observable<City[]> {
    return new  Observable<City[]>(observer => {
      observer.next(this.sliceData(size, count));
      observer.complete();
    }).pipe(delay(timeout));
  }

  getSliceData(): Observable<City[]> {
    return new  Observable<City[]>(observer => {
      observer.next(this.sliceData(15, 1));
      observer.complete();
      console.log('complete');
    });
  }

  ngOnInit(): void {
     this.getData();
  }
}
