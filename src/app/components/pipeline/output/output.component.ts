import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { ChatService } from 'src/app/services/chat.service';

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

  @Output() outputChangeEvent = new EventEmitter<OutputModel>();

  constructor(private apiService : ApiService, private chatService: ChatService) { }

  ngOnInit() {
    this.apiService.getDefaultPipeline().subscribe(pipeline => { 
      this.pipeline = pipeline;

      this.targetingRegion = pipeline.output.targetingRegion;
      this.targetGrouping = pipeline.output.targetGrouping;
      this.crosshairMode = pipeline.output.crosshairMode;
      this.crosshairAX = pipeline.output.crosshairAX;
      this.crosshairAY = pipeline.output.crosshairAY;
    });
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
