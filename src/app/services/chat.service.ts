import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import * as io from 'socket.io-client';

import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: any;
  
  constructor(private apiService : ApiService) {
    this.socket = io(apiService.getSocketUrl());
  }
  
  public setComponent(key: string, value: any) {
    console.log("[Emitting] Key: " + key + " - Value: " + value);
    this.socket.emit('set-component', key, value);
  }

  public sendBGR(b: number, g: number, r: number) {
    console.log("[Emitting] B: " + b + " - G: " + g + " - R: " + r);
    this.socket.emit('convert-hsv', b, g, r);
  }

  public sendMessage(message: any) {
    console.log("Emitting: " + message);
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('json', (msg) => {
        observer.next(msg);
      });
    });
  }
}
