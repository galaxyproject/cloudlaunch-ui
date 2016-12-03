import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'marketplace', pathMatch: 'full'},
  { path: 'about', loadChildren: 'app/about/about.module#AboutModule' },
  { path: 'auth', loadChildren: 'app/login/login.module#LoginModule' },
  { path: 'marketplace', loadChildren: 'app/marketplace/marketplace.module#MarketplaceModule' },
  { path: 'public_appliances', loadChildren: 'app/public-appliances/public-appliances.module#PublicAppliancesModule' },
  { path: 'appliances', loadChildren: 'app/my-appliances/my-appliances.module#MyAppliancesModule' },
  { path: 'profile', loadChildren: 'app/my-profile/my-profile.module#MyProfileModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
