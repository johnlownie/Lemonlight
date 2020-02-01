import { Component, OnInit } from '@angular/core';
import { PipelineService } from 'src/app/services/pipeline.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  streamUrl: string = "localhost:5801/video_feed";

  constructor(private pipelineService : PipelineService) { }

  ngOnInit() {
    this.pipelineService.getJSON().subscribe(data => {
      this.streamUrl = "http://" + data.settings.ipAddress + "/video_feed";
    });
  }

  tx: number = -14.74;
  ty: number = -0.16;
  ta: number = 0.699;
  tl: number = 3.5;
}
