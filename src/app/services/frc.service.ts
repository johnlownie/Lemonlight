import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { WebsocketService } from "./websocket.service";

const FRC_URL = "ws://frcvision.local";
const FRC_PROTOCOL = "frcvision";

@Injectable({
  providedIn: 'root'
})
export class FrcService {
  public messages: Subject<string>;

  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<string>>wsService.connect(FRC_URL, FRC_PROTOCOL).pipe(
      map((response: MessageEvent): string => {
        let data = JSON.parse(response.data);
        console.log("Response : " + data);
        return data;
      }
    ))
  }
}
