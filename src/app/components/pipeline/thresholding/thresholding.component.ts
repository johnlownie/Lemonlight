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

  initialMinHue: number;
  initialMinSaturation: number;
  initialMinValue: number;

  initialMaxHue: number;
  initialMaxSaturation: number;
  initialMaxValue: number;

  minHue: number;
  minSaturation: number;
  minValue: number;

  maxHue: number;
  maxSaturation: number;
  maxValue: number;

  initialErosion: number;
  erosion: number;

  initialDilation: number;
  dilation: number;

  constructor(private apiService : ApiService, private chatService: ChatService, private pipelineService: PipelineService) { }

  ngOnInit() {
    this.apiService.getDefaultPipeline().subscribe(data => {
      this.initialMinHue = data.thresholding.hue_lower;
      this.initialMinSaturation = data.thresholding.saturation_lower;
      this.initialMinValue = data.thresholding.value_lower;

      this.minHue = this.initialMinHue;
      this.minSaturation = this.initialMinSaturation;
      this.minValue = this.initialMinValue;

      this.initialMaxHue = data.thresholding.hue_upper;
      this.initialMaxSaturation = data.thresholding.saturation_upper;
      this.initialMaxValue = data.thresholding.value_upper;

      this.maxHue = this.initialMaxHue;
      this.maxSaturation = this.initialMaxSaturation;
      this.maxValue = this.initialMaxValue;

      this.initialErosion = data.thresholding.erosion;
      this.initialDilation = data.thresholding.dilation;
      
      this.erosion = this.initialErosion;
      this.dilation = this.initialErosion;
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

  highlightStyleOn() {
    this.pipelineService.highlightStyleOn();
  }

  highlightStyleOff() {
    this.pipelineService.highlightStyleOff();
  }

}
