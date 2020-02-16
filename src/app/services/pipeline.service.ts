import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  private styleSlider = new BehaviorSubject<boolean>(false);
  isStyleSliderSet = this.styleSlider.asObservable();

  constructor() { }

  public toggleSliderStyle() {
    this.styleSlider.next(!this.styleSlider.value);
    console.log("Toggled slider: " + this.styleSlider.value);
  }
}
