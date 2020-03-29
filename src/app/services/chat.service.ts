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
  
  public setInputComponent(key: string, value: any) {
    this.socket.emit('set-input-component', key, value);
  }
  
  public setThresholdingComponent(key: string, value1: any, value2?: any) {
    this.socket.emit('set-thresholding-component', key, value1, value2);
  }
    
  public setContourFilteringComponent(key: string, value1: any, value2?: any) {
    this.socket.emit('set-contour-filtering-component', key, value1, value2);
  }
  
  public setOutputComponent(key: string, value: any) {
    this.socket.emit('set-output-component', key, value);
  }

  public setComponent(key: string, value: any) {
    this.socket.emit('set-component', key, value);
  }

  public sendBGR(s: string, b: number, g: number, r: number) {
    this.socket.emit('convert-hsv', s, b, g, r);
  }

  public sendMessage(message: any) {
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('json', (msg) => {
        observer.next(msg);
      });
    });
  }

  public getDegrees = () => {
    return Observable.create((observer) => {
      this.socket.on('degrees', (msg) => {
        observer.next(msg);
      });
    });
  }
}
