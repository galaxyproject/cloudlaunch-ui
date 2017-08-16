import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'catalog', pathMatch: 'full' },
    { path: 'about', loadChildren: 'app/about/about.module#AboutModule' },
    { path: 'auth', loadChildren: 'app/login/login.module#LoginModule' },
    { path: 'catalog', loadChildren: 'app/catalog/catalog.module#CatalogModule' },
    { path: 'public_appliances', loadChildren: 'app/public-appliances/public-appliances.module#PublicAppliancesModule' },
    { path: 'appliances', loadChildren: 'app/my-appliances/my-appliances.module#MyAppliancesModule' },
    { path: 'profile', loadChildren: 'app/my-profile/my-profile.module#MyProfileModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
