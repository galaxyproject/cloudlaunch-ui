import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Pages
import { AboutCloudLaunchPageComponent } from './components/about-cloudlaunch-page/about-cloudlaunch-page.component';


const appRoutes: Routes = [
    { path: '', component: AboutCloudLaunchPageComponent },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class AboutRoutingModule { }
