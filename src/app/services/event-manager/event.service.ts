import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  urlBase = environment.serverurl;

  constructor(private http: HttpClient) {}

  getEventList(): Observable<any> {
    return this.http.get<any>(this.urlBase + 'inventory/event/');
  }
}
