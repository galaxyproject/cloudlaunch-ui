import { Component, Input } from '@angular/core';

import { SELECT_DIRECTIVES } from 'ng2-select';

import { Application, ApplicationVersion, ApplicationVersionCloudConfig } from '../models/application';
import { ApplicationService } from '../services/application.service';
import { DeploymentService } from '../services/deployment.service';
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
  directives: [SELECT_DIRECTIVES, AppPlaceHolderComponent, StandardLayoutComponent, ConfigPanelComponent, CloudLaunchComponent],
  providers: [DeploymentService]
})
export class ApplianceDetailComponent {
   @Input()
   application: Application;
   
   selectedVersion: ApplicationVersion;
   selectedAppCloudConfig: ApplicationVersionCloudConfig;
   applianceLaunchForm: ControlGroup;
   clouds: any[] = [];
   public errorMessage: string;

   constructor(
      fb: FormBuilder,
      private _applicationService: ApplicationService,
      private _deploymentService: DeploymentService)
   {
      this.applianceLaunchForm = fb.group({
         'application_version': ['', Validators.required],
         'target_cloud': ['', Validators.required],
         'config_app': fb.group({}),
      });
   }
   
   getApplicationVersions() {
      return this.application.versions.map(v => { v.id = v.version; v.text = v.version; return v; });
   }
   
   onVersionSelect(version) {
      let applicationVersion = this.application.versions.filter(v => { return v.version == version.id; })[0];
      (<Control>this.applianceLaunchForm.controls['application_version']).updateValue(applicationVersion.id);
      this.selectedVersion = applicationVersion;
      this.getCloudsForVersion(applicationVersion);
   }
   
   getCloudsForVersion(version) {
      this.clouds = version.cloud_config.map(cfg => { let r = cfg.cloud; r.id = r.slug; r.text = r.slug; return r; });
   }
   
   onCloudSelect(cloud) {
      (<Control>this.applianceLaunchForm.controls['target_cloud']).updateValue(cloud.id);
      this.selectedAppCloudConfig = this.selectedVersion.cloud_config.filter(v => { return v.cloud.slug == cloud.id; })[0];
   }
   
   goBack() {
      window.history.back();
   }

   onSubmit(formValues: any): void {
      this.errorMessage = null;
      formValues['application'] = this.application.slug;
      console.log(JSON.stringify(formValues));
      this._deploymentService.createDeployment(formValues).subscribe(
         data  => this.errorMessage = <any>data,
         error => this.errorMessage = <any>error);
   }
}
