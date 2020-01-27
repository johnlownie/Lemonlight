import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CameraComponent } from './components/camera/camera.component';
import { SettingsComponent } from './components/settings/settings.component';


const routes: Routes = [
  { path: 'camera', component: CameraComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: '/camera', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
