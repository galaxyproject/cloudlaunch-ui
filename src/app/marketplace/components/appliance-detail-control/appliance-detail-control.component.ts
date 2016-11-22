import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Models
import { Application, ApplicationVersion, ApplicationVersionCloudConfig } from '../../../shared/models/application';
import { Cloud } from '../../../shared/models/cloud';

//Services
import { ApplicationService } from '../../../shared/services/application.service';
import { DeploymentService } from '../../../shared/services/deployment.service';
import { AppPlaceHolderComponent } from './app-placeholder.component';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-appliance-detail-control',
  templateUrl: './appliance-detail-control.component.html',
  styleUrls: ['./appliance-detail-control.component.css']
})
export class ApplianceDetailControlComponent implements OnInit {
   @Input()
   application: Application;

   selectedVersion: ApplicationVersion;
   selectedAppCloudConfig: ApplicationVersionCloudConfig;
   applianceLaunchForm: FormGroup;
   appConfigForm: FormGroup;
   clouds: any[] = [];
   private _targetCloud: Cloud;
   public errorMessage: string;
   private submitPending: boolean = false;

   constructor(
      fb: FormBuilder,
      private _router: Router,
      private _applicationService: ApplicationService,
      private _deploymentService: DeploymentService)
   {
       this.appConfigForm = fb.group({}); 
       this.applianceLaunchForm = fb.group({
         'name': ['', Validators.required],
         'application_version': ['', Validators.required],
         'target_cloud': ['', Validators.required],
         'config_app': this.appConfigForm
      });
   }

   ngOnInit() {
      // Generate a default name for the deployment
      (<FormControl>this.applianceLaunchForm.controls['name']).setValue(this.application.slug + "-" + new Date().toJSON());
   }

   getApplicationVersions() {
      return this.application.versions.map(v => { v.id = v.version; v.text = v.version; return v; });
   }

   onVersionSelect(version: ApplicationVersion) {
      let applicationVersion = this.application.versions.filter(v => { return v.version == version.id; })[0];
      (<FormControl>this.applianceLaunchForm.controls['application_version']).setValue(applicationVersion.id);
      this.selectedVersion = applicationVersion;
      this.getCloudsForVersion(applicationVersion);
   }

   getCloudsForVersion(version: ApplicationVersion) {
      this.clouds = version.cloud_config.map(cfg => { let r = cfg.cloud; r.id = r.slug; r.text = r.name; return r; });
   }

   onCloudSelect(cloud: any) {
      this._targetCloud = this.clouds.filter(c => { return c.id == cloud.id })[0];
      (<FormControl>this.applianceLaunchForm.controls['target_cloud']).setValue(cloud.id);
      this.selectedAppCloudConfig = this.selectedVersion.cloud_config.filter(v => { return v.cloud.slug == cloud.id; })[0];
   }

   goBack() {
      window.history.back();
   }

   onSubmit(formValues: any): void {
      this.errorMessage = null;
      this.submitPending = true;
      formValues['application'] = this.application.slug;
      console.log(JSON.stringify(formValues));
      this._deploymentService.createDeployment(formValues).subscribe(
         data  => this._router.navigate(['MyAppliances']),
         error => this.handleErrors(error));
   }

   handleErrors(errors) {
      this.submitPending = false;
      if (errors) {
         if (errors.hasOwnProperty("error")) {
            this.errorMessage = `${errors.error}`;
         }

         for (let err of errors) {
            alert(err);
            //this.applianceLaunchForm.controls[error].setErrors({ remote: error });
         }
      }
      else {
         this.errorMessage = `${errors.reasonPhrase} (${errors.code})`;
      }
   }

}
