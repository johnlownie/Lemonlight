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

  hueSlider = {name: "hue", lower: 0, upper: 179};
  saturationSlider = {name: "saturation", lower: 0, upper: 255};
  valueSlider = {name: "value", lower: 0, upper: 255};
  erosionSlider = {name: "erosion", value: 0};
  dilationSlider = {name: "dilation", value: 0};

  hueInput = {name: "hue", lower: 0, upper: 179};
  saturationInput = {name: "saturation", lower: 0, upper: 255};
  valueInput = {name: "value", lower: 0, upper: 255};
  erosionInput = {name: "erosion", value: 0};
  dilationInput = {name: "dilation", value: 0};

  magicWand: string;
  @Output() magicWandEvent = new EventEmitter<string>();
  @Output() thresholdingChangeEvent = new EventEmitter<ThresholdingModel>();

  constructor(private apiService : ApiService, private chatService: ChatService, private pipelineService: PipelineService) { }

  ngOnInit() {
    this.apiService.getDefaultPipeline().subscribe(pipeline => {
      this.pipeline = pipeline;

      this.hueInput.lower = this.hueSlider.lower = pipeline.thresholding.hue.lower;
      this.saturationInput.lower = this.saturationSlider.lower = pipeline.thresholding.saturation.lower;
      this.valueInput.lower = this.valueSlider.lower = pipeline.thresholding.value.lower;

      this.hueInput.upper = this.hueSlider.upper = pipeline.thresholding.hue.upper;
      this.saturationInput.upper = this.saturationSlider.upper = pipeline.thresholding.saturation.upper;
      this.valueInput.upper = this.valueSlider.upper = pipeline.thresholding.value.upper;

      this.erosionInput.value = this.erosionSlider.value = pipeline.thresholding.erosion;
      this.dilationInput.value = this.dilationSlider.value = pipeline.thresholding.dilation;
    });

    this.chatService.getMessages().subscribe((message: any) => {
      console.log("Lower: " + JSON.stringify(message.lower));
      console.log("Upper: " + JSON.stringify(message.upper));

      if (message.wand === 'eyedropper') {
        this.setHSV(message.lower, message.upper);
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
      this.setStreamBorderStyle(this.magicWand);
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
        this.setStreamBorderStyle("");
      }
    }
  }

  getData() {
    this.pipeline.thresholding.hue.lower = this.hueInput.lower;
    this.pipeline.thresholding.saturation.lower = this.saturationInput.lower;
    this.pipeline.thresholding.value.lower = this.valueInput.lower;
    this.pipeline.thresholding.hue.upper = this.hueInput.upper;
    this.pipeline.thresholding.saturation.upper = this.saturationInput.upper;
    this.pipeline.thresholding.value.upper = this.valueInput.upper;
    this.pipeline.thresholding.erosion = this.erosionInput.value;
    this.pipeline.thresholding.dilation = this.dilationInput.value;
    
    this.thresholdingChangeEvent.emit(this.pipeline.thresholding);
  }

  setStreamBorderStyle(style: string) {
    this.pipelineService.setStreamBorderStyle(style);
  }

  updateInput($slider: any, $event: any) {
    switch($slider.name) {
      case "hue":
        this.hueInput.lower = $event.from;
        this.hueInput.upper = $event.to;
        break;
      case "saturation":
        this.saturationInput.lower = $event.from;
        this.saturationInput.upper = $event.to;
        break;
      case "value":
        this.valueInput.lower = $event.from;
        this.valueInput.upper = $event.to;
        break;
      case "erosion":
        this.erosionInput.value = $event.from;
        break;
      case "dilation":
        this.dilationInput.value = $event.from;
        break;
    }
    this.chatService.setThresholdingComponent($slider.name, $event.from, $event.to);
    this.getData();
  }
    
  updateSlider($input: any, $event: any, $lower: boolean = false) {
    let value1 = $event.target.value;
    let value2 = $event.target.value;

    switch($input.name) {
      case "hue":
        if ($lower) {
          this.hueSlider.lower = value1;
          value2 = this.hueSlider.upper;
        } else {
          value1 = this.hueSlider.lower;
          this.hueSlider.upper = value2;
        }
        break;
      case "saturation":
        if ($lower) {
          this.saturationSlider.lower = value1;
          value2 = this.saturationSlider.upper;
        } else {
          value1 = this.saturationSlider.lower;
          this.saturationSlider.upper = value2;
        }
        break;
      case "value":
        if ($lower) {
          this.valueSlider.lower = value1;
          value2 = this.valueSlider.upper;
        } else {
          value1 = this.valueSlider.lower;
          this.valueSlider.upper = value2;
        }
        break;
      case "erosion":
        this.erosionSlider.value = value1;
        break;
      case "dilation":
        this.dilationSlider.value = value1;
        break;
    }
    this.chatService.setThresholdingComponent($input.name, value1, value2);
    this.getData();
  }

  setHSV(lower: any, upper: any) {
    this.hueInput.lower = lower.lh;
    this.saturationInput.lower = lower.ls;
    this.valueInput.lower = lower.lv;

    this.hueInput.upper = upper.uh;
    this.saturationInput.upper = upper.us;
    this.valueInput.upper = upper.uv;

    this.chatService.setThresholdingComponent('hue', this.hueInput.lower, this.hueInput.upper);
    this.chatService.setThresholdingComponent('saturation', this.saturationInput.lower, this.saturationInput.upper);
    this.chatService.setThresholdingComponent('value', this.valueInput.lower, this.valueInput.upper);

    // notify the pipeline of the changes
    this.getData();
  }

  setInclude(data: any) {
    console.log(data);
    this.hueInput.lower = Math.min(this.hueInput.lower, data.lh);
    this.saturationInput.lower = Math.min(this.saturationInput.lower, data.ls);
    this.valueInput.lower = Math.min(this.valueInput.lower, data.lv);

    this.hueInput.upper = Math.max(this.hueInput.upper, data.lh);
    this.saturationInput.upper = Math.max(this.saturationInput.upper, data.ls);
    this.valueInput.upper = Math.max(this.valueInput.upper, data.lv);

    this.chatService.setComponent('lowerHue', this.hueInput.lower);
    this.chatService.setComponent('lowerSaturation', this.saturationInput.lower);
    this.chatService.setComponent('lowerValue', this.valueInput.lower);
    this.chatService.setComponent('upperHue', this.hueInput.upper);
    this.chatService.setComponent('upperSaturation', this.saturationInput.upper);
    this.chatService.setComponent('upperValue', this.valueInput.upper);

    // notify the pipeline of the changes
    this.getData();
  }

  setIgnore(data: any) {
    console.log(data);
    this.hueInput.lower = Math.max(this.hueInput.lower, data.lh);
    this.saturationInput.lower = Math.max(this.saturationInput.lower, data.ls);
    this.valueInput.lower = Math.max(this.valueInput.lower, data.lv);

    this.hueInput.upper = Math.min(this.hueInput.upper, data.uh);
    this.saturationInput.upper = Math.min(this.saturationInput.upper, data.us);
    this.valueInput.upper = Math.min(this.valueInput.upper, data.uv);

    this.chatService.setComponent('lowerHue', this.hueInput.lower);
    this.chatService.setComponent('lowerSaturation', this.saturationInput.lower);
    this.chatService.setComponent('lowerValue', this.valueInput.lower);
    this.chatService.setComponent('upperHue', this.hueInput.upper);
    this.chatService.setComponent('upperSaturation', this.saturationInput.upper);
    this.chatService.setComponent('upperValue', this.valueInput.upper);

    // notify the pipeline of the changes
    this.getData();
  }
}
