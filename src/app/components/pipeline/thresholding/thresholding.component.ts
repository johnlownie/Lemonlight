import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { ChatService } from 'src/app/services/chat.service';
import { PipelineService } from 'src/app/services/pipeline.service';
import { PipelineModel } from 'src/app/models/pipeline.model';

import { ThresholdingModel } from 'src/app/models/thresholding.model';

@Component({
  selector: 'app-thresholding',
  templateUrl: './thresholding.component.html',
  styleUrls: ['./thresholding.component.css']
})
export class ThresholdingComponent implements OnInit {
  pipeline: PipelineModel

  lowerHue: number;
  lowerSaturation: number;
  lowerValue: number;

  upperHue: number;
  upperSaturation: number;
  upperValue: number;

  erosion: number;
  dilation: number;

  magicWand: string;
  @Output() magicWandEvent = new EventEmitter<string>();
  @Output() thresholdingChangeEvent = new EventEmitter<ThresholdingModel>();

  constructor(private apiService : ApiService, private chatService: ChatService, private pipelineService: PipelineService) { }

  ngOnInit() {
    this.apiService.getDefaultPipeline().subscribe(pipeline => {
      this.pipeline = pipeline;

      this.lowerHue = pipeline.thresholding.lowerHue;
      this.lowerSaturation = pipeline.thresholding.lowerSaturation;
      this.lowerValue = pipeline.thresholding.lowerValue;

      this.upperHue = pipeline.thresholding.upperHue;
      this.upperSaturation = pipeline.thresholding.upperSaturation;
      this.upperValue = pipeline.thresholding.upperValue;
      this.erosion = pipeline.thresholding.erosion;
      this.dilation = pipeline.thresholding.dilation;
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

  getData() {
    this.pipeline.thresholding.lowerHue = this.lowerHue;
    this.pipeline.thresholding.lowerSaturation = this.lowerSaturation;
    this.pipeline.thresholding.lowerValue = this.lowerValue;
    this.pipeline.thresholding.upperHue = this.upperHue;
    this.pipeline.thresholding.upperSaturation = this.upperSaturation;
    this.pipeline.thresholding.upperValue = this.upperValue;
    this.pipeline.thresholding.erosion = this.erosion;
    this.pipeline.thresholding.dilation = this.dilation;
    
    this.thresholdingChangeEvent.emit(this.pipeline.thresholding);
  }

  highlightStyleOn() {
    this.pipelineService.highlightStyleOn();
  }

  highlightStyleOff() {
    this.pipelineService.highlightStyleOff();
  }

  setHue($event: any) {
    this.lowerHue = $event.from;
    this.upperHue = $event.to;
    this.chatService.setComponent('lowerHue', $event.from);
    this.chatService.setComponent('upperHue', $event.to);
  }

  setSaturation($event: any) {
    this.lowerSaturation = $event.from;
    this.upperSaturation = $event.to;
    this.chatService.setComponent('lowerSaturation', $event.from);
    this.chatService.setComponent('upperSaturation', $event.to);
  }

  setValue($event: any) {
    this.lowerValue = $event.from;
    this.upperValue = $event.to;
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
    this.lowerHue = data.lh;
    this.lowerSaturation = data.ls;
    this.lowerValue = data.lv;
    this.chatService.setComponent('lowerHue', this.lowerHue);
    this.chatService.setComponent('lowerSaturation', this.lowerSaturation);
    this.chatService.setComponent('lowerValue', this.lowerValue);
  }

  setUpper(data: any) {
    this.upperHue = data.uh;
    this.upperSaturation = data.us;
    this.upperValue = data.uv;
    this.chatService.setComponent('upperHue', this.upperHue);
    this.chatService.setComponent('upperSaturation', this.upperSaturation);
    this.chatService.setComponent('upperValue', this.upperValue);
  }

  setInclude(data: any) {
    this.lowerHue = Math.min(this.lowerHue, data.lh);
    this.lowerSaturation = Math.min(this.lowerSaturation, data.ls);
    this.lowerValue = Math.min(this.lowerValue, data.lv);

    this.upperHue = Math.max(this.upperHue, data.lh);
    this.upperSaturation = Math.max(this.upperSaturation, data.ls);
    this.upperValue = Math.max(this.upperValue, data.lv);
  }

  setIgnore(data: any) {
    this.lowerHue = Math.max(this.lowerHue, data.lh);
    this.lowerSaturation = Math.max(this.lowerSaturation, data.ls);
    this.lowerValue = Math.max(this.lowerValue, data.lv);

    this.upperHue = Math.min(this.upperHue, data.uh);
    this.upperSaturation = Math.min(this.upperSaturation, data.us);
    this.upperValue = Math.min(this.upperValue, data.uv);
  }
}
