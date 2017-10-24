import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatStepperModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material'
import { MatSlideToggleModule } from '@angular/material'
import { MatSelectModule } from '@angular/material'
import { MatRadioModule } from '@angular/material'
import { MatInputModule } from '@angular/material'

import { SelectModule } from 'ng2-select-compat';

import { LayoutModule } from '../shared/layout.module';

import { CatalogListComponent } from './components/catalog-list/catalog-list.component';
import { CatalogPageComponent } from './components/catalog-page/catalog-page.component';
import { ApplianceDetailPageComponent } from './components/appliance-detail-page/appliance-detail-page.component';
import { ApplianceDetailControlComponent } from './components/appliance-detail-control/appliance-detail-control.component';
import { AppPlaceHolderComponent } from './components/appliance-detail-control/app-placeholder.component';
import { CloudLaunchConfigControlComponent } from './components/cloudlaunch-config-control/cloudlaunch-config-control.component';
import { CatalogRoutingModule } from './catalog-routing.module';
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
        MatStepperModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatRadioModule,
        MatInputModule,
        SelectModule,
        CatalogRoutingModule,
        MyProfileModule,
        PluginsModule
    ],
    declarations: [
        CatalogPageComponent, CatalogListComponent, ApplianceDetailPageComponent, ApplianceDetailControlComponent,
        AppPlaceHolderComponent, CloudLaunchConfigControlComponent
    ],
    providers: [ApplicationService, DeploymentService, CloudService, ProfileService]
})
export class CatalogModule { }
