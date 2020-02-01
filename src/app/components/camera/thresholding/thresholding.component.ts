import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thresholding',
  templateUrl: './thresholding.component.html',
  styleUrls: ['./thresholding.component.css']
})
export class ThresholdingComponent implements OnInit {

  minHue: number = 0;
  minSaturation: number = 0;
  minValue: number = 0;

  maxHue: number = 255;
  maxSaturation: number = 255;
  maxValue: number = 255;

  erosion: number = 0;
  dialation: number = 0;

  constructor() { }

  ngOnInit() {
  }

}
