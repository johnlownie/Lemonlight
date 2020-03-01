import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  private streamBorderStyleSubject = new BehaviorSubject<string>("");
  streamBorderStyle = this.streamBorderStyleSubject.asObservable();

  constructor() { }

  public setStreamBorderStyle(style: string) {
    this.streamBorderStyleSubject.next(style);
  }
}
