import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Services
import { AuthGuardService } from '../login/services/auth-guard/auth-guard.service';

// Pages
import { MyProfilePageComponent } from './components/my-profile-page/my-profile-page.component';


const appRoutes: Routes = [
    { path: '', component: MyProfilePageComponent, canActivate: [AuthGuardService] }
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class MyProfileRoutingModule { }
