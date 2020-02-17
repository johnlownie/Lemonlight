import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private host: string = "http://localhost"
  private apiUrl: string = this.host + ":3000";
  private socketUrl: string = this.host + ":5801";
  private streamUrl: string = this.socketUrl + "/video_feed";
  private teamNumber: string = "0000";
  private ipAssignment: boolean = true;
  private ipAddress: string = "";

  private connected = new BehaviorSubject<boolean>(false);
  isConnected = this.connected.asObservable();

  constructor(private cookeService: CookieService, private http: HttpClient) { }

  ngOnInit(): void {
    try {
      this.teamNumber = this.cookeService.get('team-number');
      this.ipAssignment = this.cookeService.get('ip-assignment') == "true";
      this.ipAddress = this.cookeService.get('ip-address');
      this.setApiUrl();
    } catch(e) {}

  }
  
  private setApiUrl() {
    this.apiUrl = "http://" + (this.ipAssignment ? "10." + this.teamNumber.slice(0, 1) + "." + this.teamNumber.slice(2, 3) + ".11" : this.ipAddress ) + ":3000";
  }

  private handleError(error) {
    this.connected.next(false);
    return throwError(`Error: ${error.status}`);
  }

  public getSocketUrl() {
    return this.socketUrl;
  }

  public getStreamUrl() {
    return this.streamUrl;
  }

  public getSettings(): Observable<any> {
    return this.http.get(this.apiUrl + "/networks/1")
      .pipe(retry(1), catchError(this.handleError));
  }

  public getPipelines(): Observable<any> {
    return this.http.get(this.apiUrl + "/pipelines")
      .pipe(retry(1), catchError(this.handleError));
  }

  public getPipeline(id: number): Observable<any> {
    return this.http.get(this.apiUrl + "/pipelines/" + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  public getDefaultPipeline(): Observable<any> {
    return this.getPipeline(1)
      .pipe(retry(1), catchError(this.handleError));
  }
}
