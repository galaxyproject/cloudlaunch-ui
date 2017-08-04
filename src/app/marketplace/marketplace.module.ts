import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'ng2-select-compat';

import { LayoutModule } from '../shared/layout.module';

import { MarketplaceListComponent } from './components/marketplace-list/marketplace-list.component';
import { MarketplacePageComponent } from './components/marketplace-page/marketplace-page.component';
import { ApplianceDetailPageComponent } from './components/appliance-detail-page/appliance-detail-page.component';
import { ApplianceDetailControlComponent } from './components/appliance-detail-control/appliance-detail-control.component';
import { AppPlaceHolderComponent } from './components/appliance-detail-control/app-placeholder.component';
import { CloudLaunchConfigControlComponent } from './components/cloudlaunch-config-control/cloudlaunch-config-control.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { MyProfileModule } from '../my-profile/my-profile.module';
import { PluginsModule } from './plugins/plugins.module';


import { ApplicationService } from '../shared/services/application.service';
import { DeploymentService } from '../shared/services/deployment.service';
import { CloudService } from '../shared/services/cloud.service';
import { ProfileService } from '../shared/services/profile.service';


@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        MarketplaceRoutingModule,
        MyProfileModule,
        PluginsModule
    ],
    declarations: [
        MarketplacePageComponent, MarketplaceListComponent, ApplianceDetailPageComponent, ApplianceDetailControlComponent,
        AppPlaceHolderComponent, CloudLaunchConfigControlComponent
    ],
    providers: [ApplicationService, DeploymentService, CloudService, ProfileService]
})
export class MarketplaceModule { }
