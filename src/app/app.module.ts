import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraComponent } from './components/camera/camera.component';
import { SettingsComponent } from './components/settings/settings.component';
import { InputComponent } from './components/camera/input/input.component';
import { ThresholdingComponent } from './components/camera/thresholding/thresholding.component';
import { ContourFilteringComponent } from './components/camera/contour-filtering/contour-filtering.component';
import { OutputComponent } from './components/camera/output/output.component';

import { PipelineService } from './services/pipeline.service';

@NgModule({
  declarations: [
    AppComponent,
    CameraComponent,
    SettingsComponent,
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
    IonRangeSliderModule
  ],
  providers: [
    PipelineService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
