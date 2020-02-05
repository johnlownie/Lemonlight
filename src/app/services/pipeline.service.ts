import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  constructor(private http: HttpClient) { }

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
