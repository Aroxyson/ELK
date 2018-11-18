import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Notification} from '../core/notification';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  API_URL = '../assets/notifications.json';
  out: Notification[] = [];

  constructor (private http: HttpClient) {}

  public receiveItems(): Observable <Notification[]>  {
    return this.http
      .get(this.API_URL)
      .pipe(map(response => {
        const items = response;
        this.out = [];
        for (let i = 0; i < 100; i++) {
          if (items[i]) {
            this.out.push(new Notification(items[i]));
          }
        }
        if (this.out.length === 0) {
          console.log('ERROR::No data in ', this.API_URL);
          throw new Error('No data');
        }
        return this.out;
      }));
  }
}
