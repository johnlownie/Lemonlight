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
import { Select2Module } from 'ng2-select2';

import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './services/api.service';
import { PipelineService } from './services/pipeline.service';
import { ChatService } from './services/chat.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { FrcService } from 'src/app/services/frc.service';

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
    Select2Module,
    IonRangeSliderModule
  ],
  providers: [
    CookieService,
    ApiService,
    PipelineService,
    ChatService,
    WebsocketService,
    FrcService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
