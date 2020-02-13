import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';
import { PipelineService } from 'src/app/services/pipeline.service';
import { ChatService } from 'src/app/services/chat.service';

import { Pipeline } from 'src/app/models/pipeline';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.css']
})
export class PipelineComponent implements OnInit {

  pipelines: Pipeline[] = [];
  selectedPipeline: number;
  streamUrl: string;
  message: any;
  messages: string[] = [];

  showOptions: string[] = ["Colour", "Threshold"];

  constructor(private networkService : NetworkService, private pipelineService : PipelineService, private chatService: ChatService) { }

  ngOnInit() {
    this.networkService.getSettings().subscribe(data => {
      console.log("setting stream: " + data.ipAddress);
      this.streamUrl = "http://" + data.ipAddress + ":5801/video_feed";
    });

    this.pipelineService.getPipelines().subscribe(data => {
      this.pipelines.push(data);
      console.log(this.pipelines);
    });

    this.chatService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  setFeed(event) {
    console.log(event.target.value);
    let feed: string = event.target.value;
    this.message = { component: "videoFeed", value: feed.toLowerCase() };
    this.chatService.sendMessage(this.message);
  }

  tx: number = -14.74;
  ty: number = -0.16;
  ta: number = 0.699;
  tl: number = 3.5;
}
