import { NgModule }             from '@angular/core';
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Services
import { AuthGuardService } from '../services/auth-guard/auth-guard.service';

//Pages
import { LoginPageComponent } from './login-page.component';
//import { MarketplacePageComponent } from './pages/marketplace.page.component';
//import { ApplianceDetailPageComponent } from './pages/appliance-detail.page.component';
//import { MyAppliancesComponent } from './pages/my-appliances.page.component';
//import { MyProfileComponent } from './pages/my-profile.page.component';
//import { PublicAppliancesPageComponent } from './pages/public-appliances.page.component';

          
const appRoutes: Routes = [
  { path: 'login', component: LoginPageComponent },
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
export class LoginRoutingModule {}