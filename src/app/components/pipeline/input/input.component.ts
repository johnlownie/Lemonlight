import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PipelineService } from 'src/app/services/pipeline.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  pipelineType: string;
  sourceImage: string;
  resolution: string;
  leds: string;
  orientation: string;

  initialExposure: number;
  initialBlackLevel: number;
  initialRedBalance: number;
  initialBlueBalance: number;
  
  exposure: number;
  blackLevel: number;
  redBalance: number;
  blueBalance: number;

  constructor(private pipelineService : PipelineService) { }

  ngOnInit() {
    this.pipelineService.getDefaultPipeline().subscribe(data => {
      this.pipelineType = data.input.pipelineType;
      this.sourceImage = data.input.sourceImage;
      this.resolution = data.input.resolution;
      this.leds = data.input.leds;
      this.orientation = data.input.orientation;

      this.initialExposure = data.input.exposure;
      this.initialBlackLevel = data.input.blackLevel;
      this.initialRedBalance = data.input.redBalance;
      this.initialBlueBalance = data.input.blueBalance;
      
      this.exposure = this.initialExposure;
      this.blackLevel = this.initialBlackLevel;
      this.redBalance = this.initialRedBalance;
      this.blueBalance = this.initialBlueBalance;
    });
  }

  setExposure(event) {
    this.exposure = event.from;
  }

  setBlackLevel(event) {
    this.blackLevel = event.from;
  }

  setRedBalance(event) {
    this.redBalance = event.from;
  }

  setBlueBalance(event) {
    this.blueBalance = event.from;
  }
}
