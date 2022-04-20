import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Select2OptionData } from 'ng2-select2';


import { ApiService } from 'src/app/services/api.service';
import { PipelineService } from 'src/app/services/pipeline.service';
import { ChatService } from 'src/app/services/chat.service';

import { PipelineModel } from 'src/app/models/pipeline.model';
import { InputModel } from 'src/app/models/input.model';
import { ThresholdingModel } from 'src/app/models/thresholding.model';
import { ContourFilteringModel } from 'src/app/models/contour-filtering.model';
import { OutputModel } from 'src/app/models/output.model';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.css']
})
export class PipelineComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  pipelines: PipelineModel[] = [];
  selectedPipeline: PipelineModel;
  streamUrl: string;
  streamBorderStyle: string;
  isApiConnected: boolean;

  showOptions: Array<Select2OptionData> = [{id: 'colour', text: 'Colour'}, {id: 'threshold', text: 'Threshold'}];
  options: Select2Options = { minimumResultsForSearch: -1, theme: 'lemonlight' };

  canvas: any;
  base64Image: any;
  magicWand: string;

  spresp: any = [];

  tx: any = 0.0;
  ty: any = 0.0;
  ta: any = 0.0;
  tl: any = 0.0;

  constructor(private apiService : ApiService, private pipelineService : PipelineService, private chatService: ChatService) { }

  ngOnInit() {
    this.apiService.isConnected.subscribe(isConnected => this.isApiConnected = isConnected);
    this.streamUrl = this.apiService.getStreamUrl();
    
    this.apiService.getPipelines().subscribe(data => {
      this.pipelines = data;
      this.selectedPipeline = this.pipelines[0];
    });

    this.chatService.getDegrees().subscribe((message: any) => {
      let  tx = (Math.round(message.tx * 100) / 100).toFixed(2);
      this.tx = parseFloat(tx) > 0 ? `+${tx}` : tx;
      let  ty = (Math.round(message.ty * 100) / 100).toFixed(2);
      this.ty = parseFloat(ty) > 0 ? `+${ty}` : ty;
      this.ta = (Math.round(message.ta * 100) / 100).toFixed(2);
    });

    this.pipelineService.streamBorderStyle.subscribe(streamBorderStyle => this.streamBorderStyle = streamBorderStyle);
  }
  
  deleteSnapshot() {
    this.chatService.setComponent('deleteSnapshot', true);
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
      var scaleX = $event.target.width / $event.target.naturalWidth;
      var scaleY = $event.target.height / $event.target.naturalHeight;

      var x = $event.offsetX / scaleX;
      var y = $event.offsetY / scaleY;

      var pixelData = this.canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      console.log('R: ' + pixelData[0] + ' - G: ' + pixelData[1] + ' - B: ' + pixelData[2] + ' - A: ' + pixelData[3]);
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

   getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
  }

  changeInput(input: InputModel) {
    this.selectedPipeline.input = input;
  }
  
  changeThresholding(contourFilteringModel: ContourFilteringModel) {
    this.selectedPipeline.contourFiltering = contourFilteringModel;
  }
    
  changeContourFiltering(thresholding: ThresholdingModel) {
    this.selectedPipeline.thresholding = thresholding;
  }
 
  changeOutput(output: OutputModel) {
    this.selectedPipeline.output = output;
  }

  isSourceCamera() {
    return this.selectedPipeline.input.sourceImage === "Camera";
  }

  updatePipeline() {
    this.apiService.updatePipeline(this.selectedPipeline.id, this.selectedPipeline)
      .subscribe(resp => {
        console.log("Resp: " + JSON.stringify(resp));
        return this.spresp.push(resp);
      });
  }
}
