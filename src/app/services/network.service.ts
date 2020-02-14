import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private http: HttpClient) { }

  public getSettings(): Observable<any> {
    console.log("Returning settings: " + environment.apiUrl);
    return this.http.get(environment.apiUrl + "/networks/1");
  }
}
