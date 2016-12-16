import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AgmCoreModule } from 'angular2-google-maps/core';

import { LayoutModule } from '../shared/layout.module';
import { PublicAppliancesRoutingModule } from './public-appliances-routing.module';

import { AppSettings } from '../app.settings';

// Components
import { PublicAppliancesListComponent } from './components/public-appliances-list/public-appliances-list.component';
import { PublicAppliancesMapComponent } from './components/public-appliances-map/public-appliances-map.component';
import { PublicAppliancesPageComponent } from './components/public-appliances-page/public-appliances-page.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        LayoutModule,
        PublicAppliancesRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: AppSettings.CLOUDLAUNCH_GOOGLE_MAPS_KEY
        })
    ],
    declarations: [PublicAppliancesPageComponent, PublicAppliancesListComponent, PublicAppliancesMapComponent],
})
export class PublicAppliancesModule { }
