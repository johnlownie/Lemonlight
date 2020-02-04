import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.css']
})
export class PipelineComponent implements OnInit {

  streamUrl: string = "localhost:5801/video_feed";

  constructor(private networkService : NetworkService) { }

  ngOnInit() {
    this.networkService.getJSON().subscribe(data => {
      this.streamUrl = "http://" + data.settings.ipAddress + "/video_feed";
    });
  }

  tx: number = -14.74;
  ty: number = -0.16;
  ta: number = 0.699;
  tl: number = 3.5;
}
