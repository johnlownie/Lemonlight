import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Select2OptionData } from 'ng2-select2';


import { ApiService } from 'src/app/services/api.service';
import { PipelineService } from 'src/app/services/pipeline.service';
import { ChatService } from 'src/app/services/chat.service';

import { Pipeline } from 'src/app/models/pipeline.model';
import { Input } from 'src/app/models/input.model';
import { Thresholding } from 'src/app/models/thresholding.model';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.css']
})
export class PipelineComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  pipelines: Pipeline[] = [];
  selectedPipeline: Pipeline;
  streamUrl: string;
  isStyleSliderSet: boolean;
  isApiConnected: boolean;

  showOptions: Array<Select2OptionData> = [{id: 'colour', text: 'Colour'}, {id: 'threshold', text: 'Threshold'}];
  options: Select2Options = { minimumResultsForSearch: -1, theme: 'lemonlight' };

  canvas: any;
  base64Image: any;
  pixels: string;
  magicWand: string;

  tx: number = -14.74;
  ty: number = -0.16;
  ta: number = 0.699;
  tl: number = 3.5;

  constructor(private apiService : ApiService, private pipelineService : PipelineService, private chatService: ChatService) { }

  ngOnInit() {
    this.apiService.isConnected.subscribe(isConnected => this.isApiConnected = isConnected);
    this.streamUrl = this.apiService.getStreamUrl();
    this.apiService.getPipelines().subscribe(data => {
      this.pipelines = data;
      this.selectedPipeline = this.pipelines[0];
    });
    this.pipelineService.isStyleSliderSet.subscribe(isStyleSliderSet => this.isStyleSliderSet = isStyleSliderSet);
  }

  receiveMagicWand($event) {
    this.magicWand = $event;
  }

  setFeed($event: any) {
    let feedValue: string = $event.value;
    this.chatService.setComponent('videoFeed', feedValue);
  }
  
  takeSnapshot() {
    this.chatService.setComponent('takeSnapshot', true);
  }

  getRGB($event) {
    this.getBase64ImageFromURL(this.streamUrl).subscribe(base64data => {
      var pixelData = this.canvas.getContext('2d').getImageData($event.offsetX, $event.offsetY, 1, 1).data;
      this.pixels = 'R: ' + pixelData[0] + '<br>G: ' + pixelData[1] + '<br>B: ' + pixelData[2] + '<br>A: ' + pixelData[3];
      this.chatService.sendBGR(this.magicWand, pixelData[2], pixelData[1], pixelData[0]);
  });
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    var ctx = this.canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = this.canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  changeInput(input: Input) {
    this.selectedPipeline.input = input;
  }
  
  changeThresholding(thresholding: Thresholding) {
    this.selectedPipeline.thresholding = thresholding;
  }
 
  updatePipeline() {
    this.apiService.updatePipeline(this.selectedPipeline.id, this.selectedPipeline);
  }
}
