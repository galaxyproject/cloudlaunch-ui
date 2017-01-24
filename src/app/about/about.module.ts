import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LayoutModule } from '../shared/layout.module';
import { AboutRoutingModule } from './about-routing.module';

// Components
import { AboutCloudLaunchPageComponent } from './components/about-cloudlaunch-page/about-cloudlaunch-page.component';

// Services
import { DeploymentService } from '../shared/services/deployment.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule,
        AboutRoutingModule
    ],
    declarations: [AboutCloudLaunchPageComponent]
})
export class AboutModule { }
