import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'catalog', pathMatch: 'full' },
    { path: 'about', loadChildren: () => import('app/about/about.module').then(m => m.AboutModule) },
    { path: 'auth', loadChildren: () => import('app/login/login.module').then(m => m.LoginModule) },
    { path: 'catalog', loadChildren: () => import('app/catalog/catalog.module').then(m => m.CatalogModule) },
    { path: 'public_appliances', loadChildren: () => import(
        'app/public-appliances/public-appliances.module').then(m => m.PublicAppliancesModule) },
    { path: 'appliances', loadChildren: () => import('app/my-appliances/my-appliances.module').then(m => m.MyAppliancesModule) },
    { path: 'profile', loadChildren: () => import('app/my-profile/my-profile.module').then(m => m.MyProfileModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
