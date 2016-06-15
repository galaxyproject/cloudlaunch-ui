import { Component, Input } from '@angular/core';

import { SELECT_DIRECTIVES } from 'ng2-select';

import { Application, ApplicationVersion } from '../models/application';
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
  directives: [SELECT_DIRECTIVES, AppPlaceHolderComponent, StandardLayoutComponent, ConfigPanelComponent, CloudLaunchComponent]
})
export class ApplianceDetailComponent {
   @Input()
   application: Application;
   applianceLaunchForm: ControlGroup;
   clouds: any[] = [];

   constructor(
      fb: FormBuilder,
      private _applicationService: ApplicationService)
   {
      this.applianceLaunchForm = fb.group({
         'targetVersion': [''],
         'targetCloud': [''],
         'config_app': fb.group({}),
      });
   }
   
   getApplicationVersions() {
      return this.application.versions.map(v => { v.id = v.version; v.text = v.version; return v; });
   }
   
   onVersionSelect(version) {
      let applicationVersion = this.application.versions.filter(v => { return v.version == version.id; })[0];
      (<Control>this.applianceLaunchForm.controls['targetVersion']).updateValue(applicationVersion);
      this.getCloudsForVersion(applicationVersion);
   }
   
   getCloudsForVersion(version) {
      this.clouds = version.cloud_config.map(cfg => { let r = cfg.cloud; r.id = r.slug; r.text = r.slug; return r; });
   }
   
   onCloudSelect(cloud) {
      (<Control>this.applianceLaunchForm.controls['targetCloud']).updateValue(cloud.id);
   }
   
   goBack() {
      window.history.back();
   }

   onSubmit(formValues: string): void {
      console.log(JSON.stringify(formValues));
      window.alert(JSON.stringify(formValues));
   }
}
