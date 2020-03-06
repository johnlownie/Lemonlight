import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import * as io from 'socket.io-client';

const FRC_URL = "ws://frcvision.local";
const FRC_PROTOCOL = "frcvision";

@Injectable({
  providedIn: 'root'
})
export class FrcTestService {
  private socket: any;
  
  constructor() {
    this.socket = io(FRC_URL, {protocol: FRC_PROTOCOL});

    this.socket.on('connect', function() {
      console.log("Connected");
    });

    this.socket.on('disconnect', function() {
      console.log("Disconnect");
    });

    this.socket.on('event', function(data) {
      console.log("Event: " + data);
    });
  }

  public sendMessage(message: any) {
    console.log("Emitting: " + message);
    this.socket.emit(message);
  }
}
