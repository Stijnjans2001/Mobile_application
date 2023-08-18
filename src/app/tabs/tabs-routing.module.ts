import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {AuthGuard, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['account']);
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/tab1.module').then(m => m.Tab1PageModule),
        canActivate: [AuthGuard],
        data: {authGuardPipe: redirectUnauthorizedToLogin}
      },
      {
        path: 'scan',
        loadChildren: () => import('../scan/tab2.module').then(m => m.Tab2PageModule),
        canActivate: [AuthGuard],
        data: {authGuardPipe: redirectUnauthorizedToLogin}
      },
      {
        path: 'liked',
        loadChildren: () => import('../liked/liked.module').then(m => m.LikedPageModule),
        canActivate: [AuthGuard],
        data: {authGuardPipe: redirectUnauthorizedToLogin}
      },
      {
        path: 'collection',
        loadChildren: () => import('../collection/collection.module').then(m => m.CollectionPageModule),
        canActivate: [AuthGuard],
        data: {authGuardPipe: redirectUnauthorizedToLogin}
      },
      {
        path: 'account',
        loadChildren: () => import('../account/tab4.module').then(m => m.Tab4PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/account',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/account',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
