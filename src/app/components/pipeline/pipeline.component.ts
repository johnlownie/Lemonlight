import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';
import { PipelineService } from 'src/app/services/pipeline.service';

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

  constructor(private networkService : NetworkService, private pipelineService : PipelineService) { }

  ngOnInit() {
    this.networkService.getSettings().subscribe(data => {
      console.log("setting stream: " + data.ipAddress);
      this.streamUrl = "http://" + data.ipAddress + ":5801/video_feed";
    });

    this.pipelineService.getPipelines().subscribe(data => {
      this.pipelines.push(data);
      console.log(this.pipelines);
    })
  }

  tx: number = -14.74;
  ty: number = -0.16;
  ta: number = 0.699;
  tl: number = 3.5;
}
