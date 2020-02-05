import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PipelineService } from 'src/app/services/pipeline.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  initialExposure: number;
  initialRedBalance: number;
  initialBlueBalance: number;
  
  exposure: number;
  redBalance: number;
  blueBalance: number;

  constructor(private pipelineService : PipelineService) { }

  ngOnInit() {
    this.pipelineService.getDefaultPipeline().subscribe(data => {
      this.initialExposure = data.input.exposure;
      this.initialRedBalance = data.input.redBalance;
      this.initialBlueBalance = data.input.blueBalance;
      
      this.exposure = this.initialExposure;
      this.redBalance = this.initialRedBalance;
      this.blueBalance = this.initialBlueBalance;
    });
  }

  setExposure(event) {
    this.exposure = event.from;
  }

  setRedBalance(event) {
    this.redBalance = event.from;
  }

  setBlueBalance(event) {
    this.blueBalance = event.from;
  }
}
