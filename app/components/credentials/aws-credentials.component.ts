import { Component, OnInit, Input } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   Control,
   Validators,
   NgFormModel } from '@angular/common';
import { SELECT_DIRECTIVES } from 'ng2-select';

import { UserProfile } from '../../models/profile';
import { AWSCredentials } from '../../models/profile';
import { Cloud } from '../../models/cloud';
import { ProfileService } from '../../services/profile.service';
import { CloudService } from '../../services/cloud.service';
import { StandardLayoutComponent } from '../../layouts/standard-layout.component';

@Component({
   selector: 'aws-credentials',
   templateUrl: 'app/components/credentials/aws-credentials.component.html',
   directives: [StandardLayoutComponent, ROUTER_DIRECTIVES, NgSwitch, NgSwitchDefault, SELECT_DIRECTIVES],
   providers: [ProfileService, CloudService],
   inputs: ['profile']
})
export class AWSCredentialsComponent implements OnInit {
   errorMessage: string;
   profile: UserProfile;
   clouds: Cloud[];

   awsCredentialsForm: ControlGroup;
   editMode: boolean = false;
   currentObject: AWSCredentials; 
   
   cred_id: Control = new Control(null);
   cred_name: Control = new Control(null, Validators.required);
   cred_cloud: Control = new Control(null, Validators.required);
   access_key: Control = new Control(null, Validators.required);
   secret_key: Control = new Control(null, Validators.required);
   default: Control = new Control(null);
   
   constructor(
      private _router: Router,
      private _profileService: ProfileService,
      private _cloudService: CloudService,
      fb: FormBuilder) {
      this.awsCredentialsForm = fb.group({
         'id': this.cred_id,
         'name': this.cred_name,
         'cloud_id': this.cred_cloud,
         'access_key': this.access_key,
         'secret_key': this.secret_key,
         'default': this.default,
      });
   }

   ngOnInit() {
      this.editMode = false;
      this.currentObject = null;
      this._cloudService.getClouds()
         .subscribe(clouds => this.clouds = clouds.map(t => { t.id = t.slug; t.text = t.name; return t; }),
         error => this.errorMessage = <any>error,
         () => { console.log('got instance types: ', this.clouds) });
   }

   addToList(temp: any, current: any) {
   }   

   groupBy(list: any ) {
      let temp = {}
      let results = []
      if (list) {
         for (let item of list) {
            if (item.cloud.slug in temp)
               temp[item.cloud.slug].push(item);
            else {
               temp[item.cloud.slug] = []
               temp[item.cloud.slug].push(item);
            }
         }
      }
      for (let key in temp) {
         results.push({ 'cloud_id' : key, 'clouds': temp[key] }); 
      }
      return results;
   }

   onCloudSelect(cloud: any) {
      let matching_cloud = this.clouds.filter(cloud => cloud.slug == cloud.id);
      this.cred_cloud.updateValue(matching_cloud[0]);
   }
   
   setFormValues(creds: AWSCredentials) {
      this.cred_id.updateValue(creds.id);
      this.cred_name.updateValue(creds.name);
      if (creds.cloud) { // Satisfy ng2-select requirements
         creds.cloud.id = creds.cloud.slug;
         creds.cloud.text = creds.cloud.name;
      }
      this.cred_cloud.updateValue(creds.cloud);
      this.access_key.updateValue(creds.access_key);
      this.secret_key.updateValue(creds.secret_key);
      this.default.updateValue(creds.default);
   }

   addNew() {
      this.editMode = true;
      this.currentObject = null;
      // Clear form values
      this.setFormValues(new AWSCredentials());
   }

   editExisting(creds : AWSCredentials) {
      this.editMode = true;
      this.currentObject = creds;
      this.setFormValues(creds);
   }

   cancelEdit() {
      this.editMode = false;
      this.currentObject = null;
      // Clear form values
      this.setFormValues(new AWSCredentials());
   }

   saveEdit() {
      // Switch value to id before submit 
      let currentCloudSelection = this.cred_cloud.value;
      this.cred_cloud.updateValue(currentCloudSelection.id);
      if (this.currentObject) {
         this._profileService.saveCredentialsAWS(this.awsCredentialsForm.value)
            .subscribe(result => {
               this._profileService.getProfile().subscribe(result => {
                  this.profile = result;
                  this.editMode = false;
               });
            });
      }
      else {
         this._profileService.createCredentialsAWS(this.awsCredentialsForm.value)
            .subscribe(result => {
               this._profileService.getProfile().subscribe(result => {
                  this.profile = result;
                  this.editMode = false;
               });
            });
      }
      // Restore value to keep ng2-select happy
      this.cred_cloud.updateValue(currentCloudSelection);
   }
}
