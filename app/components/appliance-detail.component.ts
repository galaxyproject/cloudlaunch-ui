import { Component } from 'angular2/core';

import { Appliance } from '../models/appliance';
import { ApplianceService } from '../services/appliance.service';
import { AppPlaceHolderComponent } from './app-placeholder.component';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';

@Component({
  selector: 'appliance-detail',
  templateUrl: 'app/components/appliance-detail.component.html',
  styleUrls: ['app/components/appliance-detail.component.css'],
  inputs: ['appliance'],
  directives: [AppPlaceHolderComponent, StandardLayoutComponent]
})
export class ApplianceDetailComponent implements OnInit{
  appliance: Appliance;

  goBack() {
    window.history.back();
  }

}
