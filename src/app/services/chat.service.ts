import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { WebsocketService } from "./websocket.service";
import * as io from 'socket.io-client';

// const CHAT_URL = "ws://echo.websocket.org/";
const CHAT_URL = "ws://localhost:8765/ws";

export interface Message {
  author: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://localhost:5000';
  private socket;
  
  public messages: Subject<Message>;

  constructor() {
    this.socket = io(this.url);

    // this.messages = <Subject<Message>>wsService.connect(CHAT_URL).pipe(map(
      // (response: MessageEvent): Message => {
        // let data = JSON.parse(response.data);
        // return {
          // author: data.author,
          // message: data.message
        // };
      // }
    // ));
  }
  
  public sendMessage(message) {
    this.socket.emit('new-message', message);
  }
}
