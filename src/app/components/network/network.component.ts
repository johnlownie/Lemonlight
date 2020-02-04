import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  teamNumber: number = 0;
  ipAssignment: number = 1;
  ipAddress: number = 0;
  netmask: number = 0;
  gateway: number = 0;

  constructor(private networkService : NetworkService) { }

  ngOnInit() {
    this.networkService.getSettings().subscribe(data => {
      this.teamNumber = data.teamNumber;
      // this.ipAssignment = data.ipAssignment;
      this.ipAddress = data.ipAddress;
      this.netmask = data.netmask;
      this.gateway = data.gateway;
    });
  }
}
