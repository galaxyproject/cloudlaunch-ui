import { Component } from '@angular/core';

import { Application } from '../models/application';
import { ApplicationService } from '../services/application.service';
import { AppPlaceHolderComponent } from './app-placeholder.component';
import { ConfigPanelComponent } from '../layouts/config-panel.component';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { CloudLaunchComponent } from './cloudlaunch.component';

import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   Control,
   Validators} from '@angular/common';

@Component({
  selector: 'appliance-detail',
  templateUrl: 'app/components/appliance-detail.component.html',
  styleUrls: ['app/components/appliance-detail.component.css'],
  inputs: ['application'],
  directives: [AppPlaceHolderComponent, StandardLayoutComponent, ConfigPanelComponent, CloudLaunchComponent]
})
export class ApplianceDetailComponent {
   application: Application;
   applianceLaunchForm: ControlGroup;

   constructor(fb: FormBuilder) {
      this.applianceLaunchForm = fb.group({});
   }
   
   goBack() {
      window.history.back();
   }

   onSubmit(formValues: string): void {
      window.alert("Form data for submission:\n" + JSON.stringify(formValues));
   }
}
