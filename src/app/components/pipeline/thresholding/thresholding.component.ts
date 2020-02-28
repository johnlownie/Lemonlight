import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { ChatService } from 'src/app/services/chat.service';
import { PipelineService } from 'src/app/services/pipeline.service';

@Component({
  selector: 'app-thresholding',
  templateUrl: './thresholding.component.html',
  styleUrls: ['./thresholding.component.css']
})
export class ThresholdingComponent implements OnInit {
  minHue: number;
  minSaturation: number;
  minValue: number;

  maxHue: number;
  maxSaturation: number;
  maxValue: number;

  erosion: number;
  dilation: number;

  magicWand: string;
  @Output() magicWandEvent = new EventEmitter<string>();

  constructor(private apiService : ApiService, private chatService: ChatService, private pipelineService: PipelineService) { }

  ngOnInit() {
    this.apiService.getDefaultPipeline().subscribe(data => {
      this.minHue = data.thresholding.hue_lower;
      this.minSaturation = data.thresholding.saturation_lower;
      this.minValue = data.thresholding.value_lower;

      this.maxHue = data.thresholding.hue_upper;
      this.maxSaturation = data.thresholding.saturation_upper;
      this.maxValue = data.thresholding.value_upper;

      this.erosion = data.thresholding.erosion;
      this.dilation = data.thresholding.dilation;
    });

    this.chatService.getMessages().subscribe((message: any) => {
      console.log("Lower: " + JSON.stringify(message.lower));
      console.log("Upper: " + JSON.stringify(message.upper));

      if (message.wand === 'eyedropper') {
        this.setLower(message.lower);
        this.setUpper(message.upper);
      }
      else if (message.wand ==='include') {
        this.setInclude(message.lower);
      }
      else if (message.wand ==='ignore') {
        this.setIgnore(message.lower);
      }
    });
  }

  onButtonGroupClick($event) {
    let element = $event.target || $event.srcElement;
    
    this.magicWand = element.id;
    this.magicWandEvent.emit(this.magicWand);

    if (element.nodeName === "BUTTON") {
      let isActive = element.parentElement.querySelector(".active");
      if( isActive) {
        isActive.classList.remove("active");
      }
      this.highlightStyleOn();
    }
  }
  
  onButtonGroupBlur($event) {
    let element = $event.target || $event.srcElement;
    
    if (element.nodeName === "BUTTON") {
      let isActive = element.parentElement.querySelector(".active");
      if (isActive) {
        isActive.classList.remove("active");
      }
      isActive = element.parentElement.querySelector(".active");
      if (!isActive) {
        this.highlightStyleOff();
      }
    }
  }

  highlightStyleOn() {
    this.pipelineService.highlightStyleOn();
  }

  highlightStyleOff() {
    this.pipelineService.highlightStyleOff();
  }

  setHue($event: any) {
    this.minHue = $event.from;
    this.maxHue = $event.to;
    this.chatService.setComponent('lowerHue', $event.from);
    this.chatService.setComponent('upperHue', $event.to);
  }

  setSaturation($event: any) {
    this.minSaturation = $event.from;
    this.maxSaturation = $event.to;
    this.chatService.setComponent('lowerSaturation', $event.from);
    this.chatService.setComponent('upperSaturation', $event.to);
  }

  setValue($event: any) {
    this.minValue = $event.from;
    this.maxValue = $event.to;
    this.chatService.setComponent('lowerValue', $event.from);
    this.chatService.setComponent('upperValue', $event.to);
  }

  setErosion($event: any) {
    this.erosion = $event.from;
    this.chatService.setComponent('erosion', $event.from);
  }

  setDilation($event: any) {
    this.dilation = $event.from;
    this.chatService.setComponent('dilate', $event.from);
  }

  setLower(data: any) {
    this.minHue = data.lh;
    this.minSaturation = data.ls;
    this.minValue = data.lv;
    this.chatService.setComponent('lowerHue', this.minHue);
    this.chatService.setComponent('lowerSaturation', this.minSaturation);
    this.chatService.setComponent('lowerValue', this.minValue);
  }

  setUpper(data: any) {
    this.maxHue = data.uh;
    this.maxSaturation = data.us;
    this.maxValue = data.uv;
    this.chatService.setComponent('upperHue', this.maxHue);
    this.chatService.setComponent('upperSaturation', this.maxSaturation);
    this.chatService.setComponent('upperValue', this.maxValue);
  }

  setInclude(data: any) {
    this.minHue = Math.min(this.minHue, data.lh);
    this.minSaturation = Math.min(this.minSaturation, data.ls);
    this.minValue = Math.min(this.minValue, data.lv);

    this.maxHue = Math.max(this.maxHue, data.lh);
    this.maxSaturation = Math.max(this.maxSaturation, data.ls);
    this.maxValue = Math.max(this.maxValue, data.lv);
  }

  setIgnore(data: any) {
    this.minHue = Math.max(this.minHue, data.lh);
    this.minSaturation = Math.max(this.minSaturation, data.ls);
    this.minValue = Math.max(this.minValue, data.lv);

    this.maxHue = Math.min(this.maxHue, data.uh);
    this.maxSaturation = Math.min(this.maxSaturation, data.us);
    this.maxValue = Math.min(this.maxValue, data.uv);
  }
}
