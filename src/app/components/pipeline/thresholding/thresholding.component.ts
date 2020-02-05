import { Component, OnInit } from '@angular/core';
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

  constructor(private pipelineService : PipelineService) { }

  ngOnInit() {
    this.pipelineService.getDefaultPipeline().subscribe(data => {
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

  setHue(event) {
    this.minHue = event.from;
    this.maxHue = event.to;
  }

  setSaturation(event) {
    this.minSaturation = event.from;
    this.maxSaturation = event.to;
  }

  setValue(event) {
    this.minValue = event.from;
    this.maxValue = event.to;
  }

  setErosion(event) {
    this.erosion = event.from;
  }

  setDilation(event) {
    this.dilation = event.from;
  }

}
