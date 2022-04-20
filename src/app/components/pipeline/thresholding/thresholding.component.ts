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

  hueInput = {name: "hue", lower: 0, upper: 179};
  saturationInput = {name: "saturation", lower: 0, upper: 255};
  valueInput = {name: "value", lower: 0, upper: 255};
  erosionInput = {name: "erosion", value: 0};
  dilationInput = {name: "dilation", value: 0};

  hueSlider = {name: "hue", lower: 0, upper: 179};
  saturationSlider = {name: "saturation", lower: 0, upper: 255};
  valueSlider = {name: "value", lower: 0, upper: 255};
  erosionSlider = {name: "erosion", value: 0};
  dilationSlider = {name: "dilation", value: 0};

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
    
    if (element.id === "reset") {
      element.blur();
      return;
    }
    
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
    
  onInputChange($input: any, $event: any, $lower: boolean = false) {
    console.log('input changed');
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

    // notify the pipeline of the changes
    this.getData();
  }

  onReset() {
    this.hueInput.lower = this.hueSlider.lower = 0;
    this.saturationInput.lower = this.saturationSlider.lower = 0;
    this.valueInput.lower = this.valueSlider.lower = 0;
    this.hueInput.upper = this.hueSlider.upper = 179;
    this.saturationInput.upper = this.saturationSlider.upper = 255;
    this.valueInput.upper = this.valueSlider.upper = 255;
    this.erosionInput.value = this.erosionSlider.value = 1;
    this.dilationInput.value = this.dilationSlider.value = 1;

    this.chatService.setThresholdingComponent('hue', this.hueInput.lower, this.hueInput.upper);
    this.chatService.setThresholdingComponent('saturation', this.saturationInput.lower, this.saturationInput.upper);
    this.chatService.setThresholdingComponent('value', this.valueInput.lower, this.valueInput.upper);

    // notify the pipeline of the changes
    this.getData();
  }

  onSliderChange($slider: any, $event: any) {
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

    // notify the pipeline of the changes
    this.getData();
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

  setHSV(lower: any, upper: any) {
    this.hueInput.lower = lower.lh;
    this.saturationInput.lower = lower.ls;
    this.valueInput.lower = lower.lv;

    this.hueInput.upper = upper.uh;
    this.saturationInput.upper = upper.us;
    this.valueInput.upper = upper.uv;

    this.hueSlider.lower = lower.lh;
    this.saturationSlider.lower = lower.ls;
    this.valueSlider.lower = lower.lv;

    this.hueSlider.upper = upper.uh;
    this.saturationSlider.upper = upper.us;
    this.valueSlider.upper = upper.uv;

    this.chatService.setThresholdingComponent('hue', this.hueInput.lower, this.hueInput.upper);
    this.chatService.setThresholdingComponent('saturation', this.saturationInput.lower, this.saturationInput.upper);
    this.chatService.setThresholdingComponent('value', this.valueInput.lower, this.valueInput.upper);

    // notify the pipeline of the changes
    this.getData();
  }

  setInclude(data: any) {
    console.log(data);
    if (data.lh < this.hueInput.lower) {
      this.hueInput.lower = data.lh;
      this.chatService.setComponent('lowerHue', this.hueInput.lower);
    } else if (data.lh > this.hueInput.upper) {
      this.hueInput.upper = data.lh;
      this.chatService.setComponent('upperHue', this.hueInput.upper);
    }

    if (data.ls < this.saturationInput.lower) {
      this.saturationInput.lower = data.ls;
      this.chatService.setComponent('lowerSaturation', this.saturationInput.lower);
    } else if (data.ls > this.saturationInput.upper) {
      this.saturationInput.upper = data.ls;
      this.chatService.setComponent('upperSaturation', this.saturationInput.upper);
    }

    if (data.lv < this.valueInput.lower) {
      this.valueInput.lower = data.lv;
      this.chatService.setComponent('lowerValue', this.valueInput.lower);
    } else if (data.lv > this.valueInput.upper) {
      this.valueInput.upper = data.lv;
      this.chatService.setComponent('upperValue', this.valueInput.upper);
    }

    // notify the pipeline of the changes
    this.getData();
  }

  setIgnore(data: any) {
    console.log(data);
    if (data.lh > this.hueInput.lower && data.lh < this.hueInput.upper) {
      if (data.lh - this.hueInput.lower <= this.hueInput.upper - data.lh) {
        this.hueInput.lower = data.lh;
        this.chatService.setComponent('lowerHue', this.hueInput.lower);
      } else {
        this.hueInput.upper = data.lh;
        this.chatService.setComponent('upperHue', this.hueInput.upper);
      }
    }

    if (data.ls > this.saturationInput.lower && data.ls < this.saturationInput.upper) {
      if (data.ls - this.saturationInput.lower <= this.saturationInput.upper - data.ls) {
        this.saturationInput.lower = data.ls;
        this.chatService.setComponent('lowerSaturation', this.saturationInput.lower);
      } else {
        this.saturationInput.upper = data.ls;
        this.chatService.setComponent('upperSaturation', this.saturationInput.upper);
      }
    }

    if (data.lv > this.valueInput.lower && data.lv < this.valueInput.upper) {
      if (data.lv - this.valueInput.lower <= this.valueInput.upper - data.lv) {
        this.valueInput.lower = data.lv;
        this.chatService.setComponent('lowerValue', this.valueInput.lower);
      } else {
        this.valueInput.upper = data.lv;
        this.chatService.setComponent('upperValue', this.valueInput.upper);
      }
    }

    // notify the pipeline of the changes
    this.getData();
  }
}
