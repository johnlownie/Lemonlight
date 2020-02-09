import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://localhost:5801;
  private socket;
  
  constructor() {
    this.socket = io(this.url);
  }
  
  public sendMessage(message: any) {
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }
}
