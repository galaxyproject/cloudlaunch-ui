import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Pages
import { PublicAppliancesPageComponent } from './components/public-appliances-page/public-appliances-page.component';


const appRoutes: Routes = [
    { path: '', component: PublicAppliancesPageComponent },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class PublicAppliancesRoutingModule { }
