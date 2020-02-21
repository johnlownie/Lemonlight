import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

import { Network } from 'src/app/models/network';
import { Pipeline } from 'src/app/models/pipeline';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/xml',
    'Authorization': 'jwt-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private host: string = "http://localhost"
  private apiUrl: string = this.host + ":3000";
  private pipelineUrl: string = this.apiUrl + "/pipelines/";
  private networkUrl: string = this.apiUrl + "/networks/";
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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
  
      return of(result as T);
    };
  }
  
  private log(message: string) {
    console.log(message);
  }  

  private setApiUrl() {
    this.apiUrl = "http://" + (this.ipAssignment ? "10." + this.teamNumber.slice(0, 1) + "." + this.teamNumber.slice(2, 3) + ".11" : this.ipAddress ) + ":3000";
  }

  public addPipeline(pipeline: Pipeline): Observable<Pipeline> {
    return this.http.post<Pipeline>(this.pipelineUrl, pipeline, httpOptions)
      .pipe(catchError(this.handleError('addPipeline', pipeline)));
  }

  public deletePipeline(id: any, pipeline: Pipeline): Observable<Pipeline> {
    return this.http.delete<Pipeline>(this.pipelineUrl + id, httpOptions)
      .pipe(catchError(this.handleError('deletePipeline', pipeline)));
  }
  public getSocketUrl() {
    return this.socketUrl;
  }

  public getStreamUrl() {
    return this.streamUrl;
  }

  public getSettings(): Observable<any> {
    return this.http.get<Network>(this.networkUrl + "1")
      .pipe(retry(1), catchError(this.handleError<Network>('getSettings')));
  }

  public getPipelines(): Observable<any> {
    return this.http.get<Pipeline[]>(this.pipelineUrl)
      .pipe(retry(1), catchError(this.handleError<Pipeline[]>('getPipelines', [])));
  }

  public getPipeline(id: number): Observable<any> {
    return this.http.get<Pipeline>(this.pipelineUrl + id)
      .pipe(retry(1), catchError(this.handleError<Pipeline>('getPipeline')));
  }

  public getDefaultPipeline(): Observable<any> {
    return this.getPipeline(1)
      .pipe(retry(1), catchError(this.handleError));
  }

  public updatePipeline(id: any, pipeline: Pipeline): Observable<Pipeline> {
    return this.http.put<Pipeline>(this.pipelineUrl + id, pipeline, httpOptions)
      .pipe(catchError(this.handleError('updatePipeline', pipeline)));
  }
}
