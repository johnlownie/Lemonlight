import { Injectable } from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class FrcService {
  private socket: any;

  readonly webSocketConnection$ = (
    webSocket({
      protocol: 'frcvision',
      url: 'ws://frcvision.local',
      WebSocketCtor: WebSocket,
    })
  )

  constructor() {
    this.socket = webSocket('ws://frcvision.local');
  }

  public sendMessage(message: any) {
    console.log("Emitting: " + message);
    this.socket.emit(message);
  }
}
