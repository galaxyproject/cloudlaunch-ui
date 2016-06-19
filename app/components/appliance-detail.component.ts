import { Component, Input, OnInit } from '@angular/core';
import { SELECT_DIRECTIVES } from 'ng2-select';

import { Application, ApplicationVersion, ApplicationVersionCloudConfig } from '../models/application';
import { ApplicationService } from '../services/application.service';
import { DeploymentService } from '../services/deployment.service';
import { AppPlaceHolderComponent } from './app-placeholder.component';
import { ConfigPanelComponent } from '../layouts/config-panel.component';
import { StandardLayoutComponent } from '../layouts/standard-layout.component';
import { CloudLaunchComponent } from './cloudlaunch.component';
import { Cloud } from '../models/cloud';
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
})
export class ApplianceDetailComponent implements OnInit {
   @Input()
   application: Application;

   selectedVersion: ApplicationVersion;
   selectedAppCloudConfig: ApplicationVersionCloudConfig;
   applianceLaunchForm: ControlGroup;
   clouds: any[] = [];
   private _targetCloud: Cloud;
   public errorMessage: string;

   constructor(
      fb: FormBuilder,
      private _applicationService: ApplicationService,
      private _deploymentService: DeploymentService)
   {
      this.applianceLaunchForm = fb.group({
         'name': ['', Validators.required],
         'application_version': ['', Validators.required],
         'target_cloud': ['', Validators.required],
         'config_app': fb.group({}),
      });
   }
   
   ngOnInit() {
      // Generate a default name for the deployment
      (<Control>this.applianceLaunchForm.controls['name']).updateValue(this.application.slug + "-" + new Date().toJSON());
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
      this._targetCloud = this.clouds.filter(c => { return c.id == cloud.id })[0];
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
         data  => this.errorMessage = JSON.stringify(data, null, 2),
         error => this.errorMessage = JSON.stringify(error, null, 2));
   }
}
