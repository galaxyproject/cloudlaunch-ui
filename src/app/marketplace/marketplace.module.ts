import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '../shared/layout.module';
import { MarketplaceListComponent } from './components/marketplace-list/marketplace-list.component';
import { MarketplacePageComponent } from './components/marketplace-page/marketplace-page.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';

import { ApplicationService } from '../shared/services/application.service';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    MarketplaceRoutingModule
  ],
  declarations: [MarketplacePageComponent, MarketplaceListComponent],
  providers: [ApplicationService]
})
export class MarketplaceModule { }
