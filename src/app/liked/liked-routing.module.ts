import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LikedPage } from './liked.page';

const routes: Routes = [
  {
    path: '',
    component: LikedPage
  },
  {
    path: 'pop/:id',
    loadChildren: () => import('../shared/pop/pop.module').then(m => m.PopPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LikedPageRoutingModule {}
