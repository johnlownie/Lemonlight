import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PipelineComponent } from './components/pipeline/pipeline.component';
import { NetworkComponent } from './components/network/network.component';


const routes: Routes = [
  { path: 'camera', component: PipelineComponent },
  { path: 'settings', component: NetworkComponent },
  { path: '', redirectTo: '/camera', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
