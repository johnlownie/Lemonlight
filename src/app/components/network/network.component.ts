import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  teamNumber: number = 0;
  ipAddress: number = 0;
  netmask: number = 0;
  gateway: number = 0;

  constructor(private networkService : NetworkService) { }

  ngOnInit() {
    this.networkService.getJSON().subscribe(data => {
      this.teamNumber = data.settings.teamNumber;
      this.ipAddress = data.settings.ipAddress;
      this.netmask = data.settings.netmask;
      this.gateway = data.settings.gateway;
    });
  }
}
