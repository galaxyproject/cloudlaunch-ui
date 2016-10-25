import { NgModule }             from '@angular/core';
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Services
import { AuthGuardService } from '../login/services/auth-guard/auth-guard.service';

//Pages
import { MarketplacePageComponent } from './components/marketplace-page/marketplace-page.component';

          
const appRoutes: Routes = [
  { path: '', component: MarketplacePageComponent },
//  { path: 'appliances', component: MyAppliancesComponent, canActivate: [AuthGuardService] },
//  { path: 'public_appliances', component: PublicAppliancesPageComponent },
//  { path: 'profile', component: MyProfileComponent, canActivate: [AuthGuardService] },
//  { path: 'marketplace', component: MarketplacePageComponent, canActivate: [AuthGuardService] },
//  { path: 'marketplace/appliance/:slug/', component: ApplianceDetailPageComponent, canActivate: [AuthGuardService] },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
  })
export class MarketplaceRoutingModule {}