import { Component, OnInit } from '@angular/core';

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
      this.setLower(message.lower);
      this.setUpper(message.upper);
    });
  }

  onButtonGroupClick($event) {
    let element = $event.target || $event.srcElement;

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

}
