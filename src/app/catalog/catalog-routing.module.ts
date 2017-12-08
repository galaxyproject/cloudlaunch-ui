import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Services
import { AuthGuardService } from '../login/services/auth-guard/auth-guard.service';

// Pages
import { CatalogPageComponent } from './components/catalog-page/catalog-page.component';
import { ApplianceDetailPageComponent } from './components/appliance-detail-page/appliance-detail-page.component';


const appRoutes: Routes = [
    { path: '', component: CatalogPageComponent },
    { path: 'appliance/:slug', component: ApplianceDetailPageComponent, canActivate: [AuthGuardService] },
    { path: 'plugins', loadChildren: 'app/catalog/plugins/plugins.module#PluginsModule' }
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class CatalogRoutingModule { }
