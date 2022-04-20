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

  exposureInput = {name: 'exposure', value: 0};
  blackLevelInput = {name: 'blackLevel', value: 0};
  redBalanceInput = {name: 'redBalance', value: 0};
  blueBalanceInput = {name: 'blueBalance', value: 0};

  exposureSlider = {name: 'exposure', value: 0};
  blackLevelSlider = {name: 'blackLevel', value: 0};
  redBalanceSlider = {name: 'redBalance', value: 0};
  blueBalanceSlider = {name: 'blueBalance', value: 0};

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
      
      this.exposureInput.value = this.exposureSlider.value = pipeline.input.exposure;
      this.blackLevelInput.value = this.blackLevelSlider.value = pipeline.input.blackLevel;
      this.redBalanceInput.value = this.redBalanceSlider.value = pipeline.input.redBalance;
      this.blueBalanceInput.value = this.blueBalanceSlider.value = pipeline.input.blueBalance;
    });
  }

  getData() {
    this.pipeline.input.pipelineType = this.pipelineType;
    this.pipeline.input.sourceImage = this.sourceImage;
    this.pipeline.input.resolution = this.resolution;
    this.pipeline.input.ledState = this.ledState;
    this.pipeline.input.orientation = this.orientation;
    
    this.pipeline.input.exposure = this.exposureInput.value;
    this.pipeline.input.blackLevel = this.blackLevelInput.value;
    this.pipeline.input.redBalance = this.redBalanceInput.value;
    this.pipeline.input.blueBalance = this.blueBalanceInput.value;
    
    this.inputChangeEvent.emit(this.pipeline.input);
  }
    
  onInputChange($input: any, $event: any) {
    switch($input.name) {
      case "exposure":
        this.exposureSlider.value = $event.target.value;
        break;
      case "blackLevel":
        this.blackLevelSlider.value = $event.target.value;
        break;
      case "redBalance":
        this.redBalanceSlider.value = $event.target.value;
        break;
      case "blueBalance":
        this.blueBalanceSlider.value = $event.target.value;
        break;
    }
    this.chatService.setInputComponent($input.name, $event.target.value);
    this.getData();
  }
  
  onSelectChange($component: string, $value: any) {
    this.chatService.setInputComponent($component, $value);
    this.getData();
  }

  onSliderChange($slider: any, $event: any) {
    switch($slider.name) {
      case "exposure":
        this.exposureInput.value = $event.from;
        break;
      case "blackLevel":
        this.blackLevelInput.value = $event.from;
        break;
      case "redBalance":
        this.redBalanceInput.value = $event.from;
        break;
      case "blueBalance":
        this.blueBalanceInput.value = $event.from;
        break;
    }
    this.chatService.setInputComponent($slider.name, $event.from);
    this.getData();
  }
}
