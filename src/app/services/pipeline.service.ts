import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Select2OptionData } from 'ng2-select2';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  getTargetingGroupList(): Observable<Array<Select2OptionData>> {
    return Observable.create((obs) => {
        obs.next([
            {
                id: 'single',
                text: 'Single Target'
            },
            {
                id: 'dual',
                text: 'Dual Target'
            },
            {
                id: 'in',
                text: 'In Target'
            }
        ]);
        obs.complete();
    });
  }

  private _streamBorderStyle = new BehaviorSubject<string>("");
  streamBorderStyle = this._streamBorderStyle.asObservable();

  private _targetGrouping = new BehaviorSubject<string>("");
  targetGrouping = this._targetGrouping.asObservable();

  constructor() { }

  public setStreamBorderStyle(style: string) {
    this._streamBorderStyle.next(style);
  }

  public setTargetGrouping(value: string) {
    this._targetGrouping.next(value);
  }
}
