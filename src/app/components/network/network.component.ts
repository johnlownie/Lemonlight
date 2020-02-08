import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  teamNumber: number;
  streamRate: string;
  streamResolution: string;
  
  ipAssignment: boolean;
  ipAddress: number;
  netmask: number;
  gateway: number;

  hostname: string;
  preview: string;

  constructor(private networkService : NetworkService) { }

  ngOnInit() {
    this.networkService.getSettings().subscribe(data => {
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
}
