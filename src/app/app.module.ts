import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BlockUIModule } from 'ng-block-ui';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PipelineComponent } from './components/pipeline/pipeline.component';
import { NetworkComponent } from './components/network/network.component';
import { InputComponent } from './components/pipeline/input/input.component';
import { ThresholdingComponent } from './components/pipeline/thresholding/thresholding.component';
import { ContourFilteringComponent } from './components/pipeline/contour-filtering/contour-filtering.component';
import { OutputComponent } from './components/pipeline/output/output.component';

import { ApiService } from './services/api.service';
import { PipelineService } from './services/pipeline.service';
import { ChatService } from './services/chat.service';

@NgModule({
  declarations: [
    AppComponent,
    PipelineComponent,
    NetworkComponent,
    InputComponent,
    ThresholdingComponent,
    ContourFilteringComponent,
    OutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BlockUIModule.forRoot(),
    IonRangeSliderModule
  ],
  providers: [
    ApiService,
    PipelineService,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
