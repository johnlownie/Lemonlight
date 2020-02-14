import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  private styleSlider = new BehaviorSubject<boolean>(false);
  isStyleSliderSet = this.styleSlider.asObservable();

  constructor(private http: HttpClient) { }

  public getPipelines(): Observable<any> {
    console.log("Returning pipelines: " + environment.apiUrl);
    return this.http.get(environment.apiUrl + "/pipelines");
  }

  public getPipeline(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + "/pipelines/" + id);
  }

  public getDefaultPipeline(): Observable<any> {
    return this.getPipeline(1);
  }

  public toggleSliderStyle() {
    this.styleSlider.next(!this.styleSlider.value);
    console.log("Toggled slider: " + this.styleSlider.value);
  }
}
