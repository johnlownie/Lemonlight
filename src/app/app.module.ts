import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraComponent } from './components/camera/camera.component';
import { SettingsComponent } from './components/settings/settings.component';
import { InputComponent } from './components/camera/input/input.component';
import { ThresholdingComponent } from './components/camera/thresholding/thresholding.component';
import { ContourFilteringComponent } from './components/camera/contour-filtering/contour-filtering.component';
import { OutputComponent } from './components/camera/output/output.component';

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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
