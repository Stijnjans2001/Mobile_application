import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {redirectUnauthorizedTo, AuthGuard} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['account']);
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/tab4.module').then(m => m.Tab4PageModule),
    canActivate: [AuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'pop/:id',
    loadChildren: () => import('./shared/pop/pop.module').then(m => m.PopPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
