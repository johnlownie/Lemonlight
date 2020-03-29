import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Select2Component, Select2OptionData } from 'ng2-select2'

import { ApiService } from 'src/app/services/api.service';
import { ChatService } from 'src/app/services/chat.service';
import { PipelineService } from 'src/app/services/pipeline.service';

import { PipelineModel } from 'src/app/models/pipeline.model';
import { ContourFilteringModel } from 'src/app/models/contour-filtering.model';

@Component({
  selector: 'app-contour-filtering',
  templateUrl: './contour-filtering.component.html',
  styleUrls: ['./contour-filtering.component.css']
})
export class ContourFilteringComponent implements OnInit {
  pipeline: PipelineModel

  sortMode: string;

  areaInput = {name: 'area', lower: 0, upper: 0};
  fullnessInput = {name: 'fullness', lower: 0, upper: 0};
  ratioInput = {name: 'ratio', lower: 0, upper: 0};
  smartSpeckleInput = {name: 'smartSpeckle', value: 0};

  areaSlider = {name: 'area', lower: 0, upper: 0};
  fullnessSlider = {name: 'fullness', lower: 0, upper: 0};
  ratioSlider = {name: 'ratio', lower: 0, upper: 0};
  smartSpeckleSlider = {name: 'smartSpeckle', value: 0};

  directionFilter: string;
  targetGrouping: string;
  intersectionFilter: string;

  options: Select2Options = { minimumResultsForSearch: -1, theme: 'lemonlight' };
  public targetGroupingData: Array<Select2OptionData>;

  @ViewChild('targetGroupingSelect', {static: false}) targetGroupingSelect: Select2Component;
  @Output() contourFilteringChangeEvent = new EventEmitter<ContourFilteringModel>();

  constructor(private apiService : ApiService, private chatService: ChatService, private pipelineService: PipelineService) { }

  ngOnInit() {
    this.pipelineService.getTargetingGroupList().subscribe(targetGroupingData => this.targetGroupingData = targetGroupingData);

    this.pipelineService.targetGrouping.subscribe(targetGrouping => this.targetGrouping = targetGrouping);
    
    this.apiService.getDefaultPipeline().subscribe(pipeline => {
      this.pipeline = pipeline;

      this.sortMode = pipeline.contourFiltering.sortMode;
      
      this.areaInput.lower = this.areaSlider.lower = pipeline.contourFiltering.area.lower;
      this.fullnessInput.lower = this.fullnessSlider.lower = pipeline.contourFiltering.fullness.lower;
      this.ratioInput.lower = this.ratioSlider.lower = pipeline.contourFiltering.ratio.lower;

      this.areaInput.upper = this.areaSlider.upper = pipeline.contourFiltering.area.upper;
      this.fullnessInput.upper = this.fullnessSlider.upper = pipeline.contourFiltering.fullness.upper;
      this.ratioInput.upper = this.ratioSlider.upper = pipeline.contourFiltering.ratio.upper;

      this.directionFilter = pipeline.contourFiltering.directionFilter;
      this.smartSpeckleInput.value = this.smartSpeckleSlider.value = pipeline.contourFiltering.smartSpeckle;
      this.targetGrouping = pipeline.output.targetGrouping;
      this.intersectionFilter = pipeline.contourFiltering.intersectionFilter;
    });
  }

  getData() {
    this.pipeline.contourFiltering.sortMode = this.sortMode;
    this.pipeline.contourFiltering.area.lower = this.areaInput.lower;
    this.pipeline.contourFiltering.fullness.lower = this.fullnessInput.lower;
    this.pipeline.contourFiltering.ratio.lower = this.ratioInput.lower;
    this.pipeline.contourFiltering.area.upper = this.areaInput.upper;
    this.pipeline.contourFiltering.fullness.upper = this.fullnessInput.upper;
    this.pipeline.contourFiltering.ratio.upper = this.ratioInput.upper;
    this.pipeline.contourFiltering.directionFilter = this.directionFilter;
    this.pipeline.contourFiltering.smartSpeckle = this.smartSpeckleInput.value;
    this.pipeline.output.targetGrouping = this.targetGrouping;
    this.pipeline.contourFiltering.intersectionFilter = this.intersectionFilter;
    
    this.contourFilteringChangeEvent.emit(this.pipeline.contourFiltering);
  }
  
  updateDropdown($component: string, $value: any) {
    switch($component) {
      case "sortMode":
        this.sortMode = $value;
        break;
      case "directionFilter":
        this.directionFilter = $value;
        break;
      case "targetGrouping":
        this.targetGrouping = $value;
        this.pipelineService.setTargetGrouping($value);
        break;
      case "intersectionFilter":
        this.intersectionFilter = $value;
        break;
    }
    this.chatService.setContourFilteringComponent($component, $value);
    this.getData();
  }

  updateInput($slider: any, $event: any) {
    switch($slider.name) {
      case "area":
        this.areaInput.lower = $event.from;
        this.areaInput.upper = $event.to;
        break;
      case "fullness":
        this.fullnessInput.lower = $event.from;
        this.fullnessInput.upper = $event.to;
        break;
      case "ratio":
        this.ratioInput.lower = $event.from;
        this.ratioInput.upper = $event.to;
        break;
      case "smartSpeckle":
        this.smartSpeckleInput.value = $event.from;
        break;
    }
    this.chatService.setContourFilteringComponent($slider.name, $event.from, $event.to);
    this.getData();
  }
    
  updateSlider($input: any, $event: any, $lower: boolean = false) {
    let value1 = $event.target.value;
    let value2 = $event.target.value;

    switch($input.name) {
      case "area":
        if ($lower) {
          this.areaSlider.lower = value1;
          value2 = this.areaSlider.upper;
        } else {
          value1 = this.areaSlider.lower;
          this.areaSlider.upper = value2;
        }
        break;
      case "fullness":
        if ($lower) {
          this.fullnessSlider.lower = value1;
          value2 = this.fullnessSlider.upper;
        } else {
          value1 = this.fullnessSlider.lower;
          this.fullnessSlider.upper = value2;
        }
        break;
      case "ratio":
        if ($lower) {
          this.ratioSlider.lower = value1;
          value2 = this.ratioSlider.upper;
        } else {
          value1 = this.ratioSlider.lower;
          this.ratioSlider.upper = value2;
        }
        break;
      case "smartSpeckle":
        this.smartSpeckleSlider.value = value1;
        break;
    }
    this.chatService.setContourFilteringComponent($input.name, value1, value2);
    this.getData();
  }
}
