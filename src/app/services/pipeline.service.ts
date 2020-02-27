import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  private highlightStyle = new BehaviorSubject<boolean>(false);
  isStyleSliderSet = this.highlightStyle.asObservable();

  constructor() { }

  public highlightStyleOn() {
    this.highlightStyle.next(true);
  }

  public highlightStyleOff() {
    this.highlightStyle.next(false);
  }
}
