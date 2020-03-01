import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { ChatService } from 'src/app/services/chat.service';

import { PipelineModel } from 'src/app/models/pipeline.model';
import { InputModel } from 'src/app/models/input.model';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  
  pipeline: PipelineModel;

  pipelineType: string;
  sourceImage: string;
  resolution: string;
  ledState: string;
  orientation: string;

  exposure: number;
  blackLevel: number;
  redBalance: number;
  blueBalance: number;

  options: Select2Options = { minimumResultsForSearch: -1, theme: 'lemonlight' };

  @Output() inputChangeEvent = new EventEmitter<InputModel>();

  constructor(private apiService : ApiService, private chatService: ChatService) { }

  ngOnInit() {
    this.apiService.getDefaultPipeline().subscribe(pipeline => { 
      this.pipeline = pipeline;

      this.pipelineType = pipeline.input.pipelineType;
      this.sourceImage = pipeline.input.sourceImage;
      this.resolution = pipeline.input.resolution;
      this.ledState = pipeline.input.ledState;
      this.orientation = pipeline.input.orientation;
      
      this.exposure = pipeline.input.exposure;
      this.blackLevel = pipeline.input.blackLevel;
      this.redBalance = pipeline.input.redBalance;
      this.blueBalance = pipeline.input.blueBalance;
    });
  }

  getData() {
    this.pipeline.input.pipelineType = this.pipelineType;
    this.pipeline.input.sourceImage = this.sourceImage;
    this.pipeline.input.resolution = this.resolution;
    this.pipeline.input.ledState = this.ledState;
    this.pipeline.input.orientation = this.orientation;
    
    this.pipeline.input.blackLevel = this.blackLevel;
    this.pipeline.input.redBalance = this.redBalance;
    this.pipeline.input.blueBalance = this.blueBalance;
    
    this.inputChangeEvent.emit(this.pipeline.input);
  }
  
  setPipelineType(value: any) {
    this.pipelineType = value;
    this.chatService.setComponent('pipelineType', value);
    this.getData();
  }
  
  setSourceImage(value: any) {
    this.sourceImage = value;
    this.chatService.setComponent('sourceImage', value);
    this.getData();
  }
  
  setResolution(value: any) {
    this.resolution = value;
    this.chatService.setComponent('resolution', value);
    this.getData();
  }
   
  setLedState(value: any) {
    this.ledState = value;
    this.chatService.setComponent('ledState', value);
    this.getData();
  }
  
  setOrientation(value: any) {
    this.orientation = value;
    this.chatService.setComponent('orientation', value);
    this.getData();
  }
  
  setExposure($event: any) {
    this.exposure = $event.from;
    this.chatService.setComponent('exposure', $event.from);
    this.getData();
  }
  
  setBlackLevel($event: any) {
    this.blackLevel = $event.from;
    this.chatService.setComponent('blackLevel', $event.from);
    this.getData();
  }
  
  setRedBalance($event: any) {
    this.redBalance = $event.from;
    this.chatService.setComponent('redBalance', $event.from);
    this.getData();
  }
  
  setBlueBalance($event: any) {
    this.blueBalance = $event.from;
    this.chatService.setComponent('blueBalance', $event.from);
    this.getData();
  }
}
