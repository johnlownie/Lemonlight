import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiService } from 'src/app/services/api.service';
import { PipelineService } from 'src/app/services/pipeline.service';
import { ChatService } from 'src/app/services/chat.service';

import { Pipeline } from 'src/app/models/pipeline';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.css']
})
export class PipelineComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  pipelines: Pipeline[] = [];
  selectedPipeline: number;
  streamUrl: string;
  message: any;
  messages: string[] = [];
  isStyleSliderSet: boolean;
  isApiConnected: boolean;

  showOptions: string[] = ["Colour", "Threshold"];

  constructor(private apiService : ApiService, private pipelineService : PipelineService, private chatService: ChatService) { }

  ngOnInit() {
    this.apiService.isConnected.subscribe(isConnected => this.isApiConnected = isConnected);
    
    this.streamUrl = this.apiService.getStreamUrl();

    this.apiService.getPipelines().subscribe(data => {
      this.pipelines.push(data);
      console.log(this.pipelines);
    });

    this.chatService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.pipelineService.isStyleSliderSet.subscribe(isStyleSliderSet => this.isStyleSliderSet = isStyleSliderSet);
  }

  setFeed(event: any) {
    let feedValue: string = event.target.value;
    this.chatService.setComponent('videoFeed', feedValue);
  }

  tx: number = -14.74;
  ty: number = -0.16;
  ta: number = 0.699;
  tl: number = 3.5;
}
