import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private connected = new BehaviorSubject<boolean>(false);
  isConnected = this.connected.asObservable();

  constructor(private http: HttpClient) { }

  public getSettings(): Observable<any> {
    return this.http.get(environment.apiUrl + "/networks/1");
  }

  public getPipelines(): Observable<any> {
    return this.http.get(environment.apiUrl + "/pipelines");
  }

  public getPipeline(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + "/pipelines/" + id);
  }

  public getDefaultPipeline(): Observable<any> {
    return this.getPipeline(1);
  }
}
