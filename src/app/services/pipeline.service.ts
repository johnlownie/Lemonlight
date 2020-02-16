import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  private styleSlider = new BehaviorSubject<boolean>(false);
  isStyleSliderSet = this.styleSlider.asObservable();

<<<<<<< HEAD
  constructor() { }
=======
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
>>>>>>> c2051d7ee3cda8d4a85640a06da3a34b2a5b3f8b

  public toggleSliderStyle() {
    this.styleSlider.next(!this.styleSlider.value);
    console.log("Toggled slider: " + this.styleSlider.value);
  }
}
