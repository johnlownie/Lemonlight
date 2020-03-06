import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { ApiService } from 'src/app/services/api.service';
import { FrcChatService } from 'src/app/services/frc-chat.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  private teamNumber: string;
  private streamRate: string;
  private streamResolution: string;
  
  private ipAssignment: boolean = true;
  private ipAddress: string;
  private netmask: string;
  private gateway: string;

  private hostname: string;
  private preview: string;

  private message: any = {};
  private subscription: Subscription;

  constructor(private apiService : ApiService, private frcService : FrcChatService) { 
    this.subscription = this.frcService.getMessage().subscribe(message => {
      this.message = message;
    });
  }

  ngOnInit() {
    this.apiService.getSettings().subscribe(data => {
      this.teamNumber = data.teamNumber;
      this.streamRate = data.streamRate;
      this.streamResolution = data.streamResolution;
      
      this.ipAssignment = data.ipAssignment;
      this.ipAddress = data.ipAddress;
      this.netmask = data.netmask;
      this.gateway = data.gateway;

      this.hostname = data.hostname;
      this.preview = data.preview;
    });
  }

  readOnly() {
    let message = {
      type: 'systemReadOnly'
    }

    console.log("Sending : " + JSON.stringify(message));
    this.frcService.sendMessage(JSON.stringify(message));
  }

  saveSettings() {
    let message = {
      type: 'networkSave',
      networkApproach: 'static',
      networkAddress: this.ipAddress,
      networkMask: this.netmask,
      networkGateway: this.gateway,
      networkDNS: '192.168.24.1'
    }

    console.log("Sending : " + JSON.stringify(message));
    this.frcService.sendMessage(JSON.stringify(message));
  }
}
