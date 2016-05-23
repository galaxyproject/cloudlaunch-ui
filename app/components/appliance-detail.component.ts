import { Component } from '@angular/core';

import { Application } from '../models/application';
import { ApplicationService } from '../services/application.service';
import { AppPlaceHolderComponent } from './app-placeholder.component';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';

@Component({
  selector: 'appliance-detail',
  templateUrl: 'app/components/appliance-detail.component.html',
  styleUrls: ['app/components/appliance-detail.component.css'],
  inputs: ['application'],
  directives: [AppPlaceHolderComponent, StandardLayoutComponent]
})
export class ApplianceDetailComponent {
  application: Application;

  goBack() {
    window.history.back();
  }

}
