import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://localhost:5801';
  private socket: any;
  
  constructor() {
    this.socket = io(this.url);
  }
  
  public setComponent(key: string, value: any) {
    let message = { 'component': key, 'value': value }
    this.sendMessage(JSON.stringify(message));
  }

  public sendMessage(message: any) {
    console.log("Emitting: " + message);
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('ack-response', (msg) => {
        console.log(msg);
        observer.next(msg);
      });
    });
  }
}
