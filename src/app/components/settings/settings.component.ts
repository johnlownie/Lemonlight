import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PipelineService } from 'src/app/services/pipeline.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  teamNumber: number = 0;
  ipAddress: number = 0;
  netmask: number = 0;
  gateway: number = 0;

  constructor(private pipelineService : PipelineService) { }

  ngOnInit() {
    this.pipelineService.getJSON().subscribe(data => {
      this.teamNumber = data.settings.teamNumber;
      this.ipAddress = data.settings.ipAddress;
      this.netmask = data.settings.netmask;
      this.gateway = data.settings.gateway;
    });
  }
}
