import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';

import { ApiService } from 'src/app/services/api.service';
import { ChatService } from 'src/app/services/chat.service';

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

  exposure: number;
  blackLevel: number;
  redBalance: number;
  blueBalance: number;

  ledOptions: Array<Select2OptionData> = [{id: 'on', text: 'On'}, {id: 'off', text: 'Off'}];
  options: Select2Options = { minimumResultsForSearch: -1, theme: 'lemonlight' };

  constructor(private apiService : ApiService, private chatService: ChatService) { }

  ngOnInit() {
    this.apiService.getDefaultPipeline().subscribe(data => {
      this.pipelineType = data.input.pipelineType;
      this.sourceImage = data.input.sourceImage;
      this.resolution = data.input.resolution;
      this.leds = data.input.leds;
      this.orientation = data.input.orientation;
      
      this.exposure = data.input.exposure;
      this.blackLevel = data.input.blackLevel;
      this.redBalance = data.input.redBalance;
      this.blueBalance = data.input.blueBalance;
    });
  }

  setComponent(component: string, value: any) {
    this.chatService.setComponent(component, value);
  }

  setExposure($event: any) {
    this.exposure = $event.from;
    this.chatService.setComponent('exposure', $event.from);
  }

  setBlackLevel($event: any) {
    this.blackLevel = $event.from;
    this.chatService.setComponent('blackLevel', $event.from);
  }

  setRedBalance($event: any) {
    this.redBalance = $event.from;
    this.chatService.setComponent('redBalance', $event.from);
  }

  setBlueBalance($event: any) {
    this.blueBalance = $event.from;
    this.chatService.setComponent('blueBalance', $event.from);
  }
}
