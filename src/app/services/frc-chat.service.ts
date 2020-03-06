import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WebsocketService } from "./websocket.service";

const FRC_URL = "ws://frcvision.local";
const FRC_PROTOCOL = "frcvision";

@Injectable({
  providedIn: 'root'
})
export class FrcChatService {
  public messages: Subject<string>;

  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<string>>wsService
      .connect(FRC_URL, FRC_PROTOCOL).pipe(
        map((response: MessageEvent): string => {
          let data = JSON.parse(response.data);
          console.log("Response : " + JSON.stringify(data));
          return data;
        }
      ));
  }

  clearMessage() {
    this.messages.next();
  }

  getMessage(): Observable<any> {
    return this.messages.asObservable();
  }

  sendMessage(message: any) {
    this.messages.next(message);
  }
}
