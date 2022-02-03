import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodesComponent } from './nodes/nodes.component';

const routes: Routes = [
  // { path: '', redirectTo: '/nodes', pathMatch: 'full' },
  { path: '', component: NodesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
