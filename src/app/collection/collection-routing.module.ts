import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectionPage } from './collection.page';

const routes: Routes = [
  {
    path: '',
    component: CollectionPage
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
export class CollectionPageRoutingModule {}
