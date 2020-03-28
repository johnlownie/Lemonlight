import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Select2Component, Select2OptionData } from 'ng2-select2'

import { ApiService } from 'src/app/services/api.service';
import { ChatService } from 'src/app/services/chat.service';
import { PipelineService } from 'src/app/services/pipeline.service';

import { PipelineModel } from 'src/app/models/pipeline.model';
import { OutputModel } from 'src/app/models/output.model';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {
  
  pipeline: PipelineModel;

  targetingRegion: string;
  targetGrouping: string;
  crosshairMode: string;
  crosshairAX: number;
  crosshairAY: number;

  options: Select2Options = { minimumResultsForSearch: -1, theme: 'lemonlight' };
  public targetGroupingData: Array<Select2OptionData>;

  @Output() outputChangeEvent = new EventEmitter<OutputModel>();

  constructor(private apiService : ApiService, private chatService: ChatService, private pipelineService: PipelineService) { }

  ngOnInit() {
    this.pipelineService.getTargetingGroupList().subscribe(targetGroupingData => this.targetGroupingData = targetGroupingData);

    this.apiService.getDefaultPipeline().subscribe(pipeline => { 
      this.pipeline = pipeline;

      this.targetingRegion = pipeline.output.targetingRegion;
      this.targetGrouping = pipeline.output.targetGrouping;
      this.crosshairMode = pipeline.output.crosshairMode;
      this.crosshairAX = pipeline.output.crosshairAX;
      this.crosshairAY = pipeline.output.crosshairAY;
    });

    this.pipelineService.targetGrouping.subscribe(targetGrouping => this.targetGrouping = targetGrouping);
  }

  getData() {
    this.pipeline.output.targetingRegion = this.targetingRegion;
    this.pipeline.output.targetGrouping = this.targetGrouping;
    this.pipeline.output.crosshairMode = this.crosshairMode;
    this.pipeline.output.crosshairAX = this.crosshairAX;
    this.pipeline.output.crosshairAY = this.crosshairAY;
    
    this.outputChangeEvent.emit(this.pipeline.output);
  }

  setTargetingRegion(value: any) {
    this.targetingRegion = value;
    this.chatService.setOutputComponent('targetingRegion', value);
    this.getData();
  }
  
  setTargetGrouping(value: any) {
    this.targetGrouping = value;
    this.chatService.setOutputComponent('targetGrouping', value);
    this.pipelineService.setTargetGrouping(value);
    this.getData();
  }
  
  setCrosshairMode(value: any) {
    this.crosshairMode = value;
    this.chatService.setOutputComponent('crosshairMode', value);
    this.getData();
  }

  setOutputComponent(component: string, value: any) {
    this.chatService.setOutputComponent(component, value);
  }

}
