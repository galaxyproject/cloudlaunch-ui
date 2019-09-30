import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

import { OrderModule } from 'ngx-order-pipe';

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
        MatCheckboxModule,
        MatTooltipModule,
        MatIconModule,
        OrderModule,
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
