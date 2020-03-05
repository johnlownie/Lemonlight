import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { FrcService } from 'src/app/services/frc.service';

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

  constructor(private apiService : ApiService, private frcService : FrcService) { }

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

      console.log("URL: " + window.location.hostname);
      console.log("Port: " + window.location.port);
    });
  }

  readOnly() {
    let message = {
      type: 'systemReadOnly'
    }

    console.log("Sending : " + JSON.stringify(message));
    this.frcService.messages.next(JSON.stringify(message));
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
    this.frcService.messages.next(JSON.stringify(message));
  }
}
