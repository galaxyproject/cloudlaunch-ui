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
import { OpenStackCredentials } from '../../models/profile';
import { Cloud } from '../../models/cloud';
import { ProfileService } from '../../services/profile.service';
import { CloudService } from '../../services/cloud.service';
import { StandardLayoutComponent } from '../../layouts/standard-layout.component';

@Component({
   selector: 'openstack-credentials',
   templateUrl: 'app/components/credentials/openstack-credentials.component.html',
   directives: [StandardLayoutComponent, ROUTER_DIRECTIVES, NgSwitch, NgSwitchDefault, SELECT_DIRECTIVES],
   providers: [ProfileService, CloudService],
   inputs: ['profile']
})
export class OpenStackCredentialsComponent implements OnInit {
   errorMessage: string;
   profile: UserProfile;
   clouds: Cloud[];

   openstackCredentialsForm: ControlGroup;
   editMode: boolean = false;
   currentObject: OpenStackCredentials; 
   
   cred_id: Control = new Control(null);
   cred_name: Control = new Control(null, Validators.required);
   cred_cloud: Control = new Control(null, Validators.required);
   username: Control = new Control(null, Validators.required);
   password: Control = new Control(null, Validators.required);
   tenant_name: Control = new Control(null, Validators.required);
   default: Control = new Control(null);
   
   constructor(
      private _router: Router,
      private _profileService: ProfileService,
      private _cloudService: CloudService,
      fb: FormBuilder) {
      this.openstackCredentialsForm = fb.group({
         'id': this.cred_id,
         'name': this.cred_name,
         'cloud_id': this.cred_cloud,
         'username': this.username,
         'password': this.password,
         'tenant_name': this.tenant_name,
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

   groupBy(list: any) {
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
      let matching_cloud = this.clouds.filter(c => c.slug == cloud.id);
      this.cred_cloud.updateValue(matching_cloud[0]);
   }
   
   getSelectedCloud() {
      if (this.clouds && this.cred_cloud.value)
         return this.clouds.filter(c => c.id == this.cred_cloud.value.id);
      else
         return null;
   }
   
   setFormValues(creds: OpenStackCredentials) {
      this.cred_id.updateValue(creds.id);
      this.cred_name.updateValue(creds.name);
      if (creds.cloud) { // Satisfy ng2-select requirements
         creds.cloud.id = creds.cloud.slug;
         creds.cloud.text = creds.cloud.name;
      }
      this.cred_cloud.updateValue(creds.cloud);
      this.username.updateValue(creds.username);
      this.password.updateValue(creds.password);
      this.tenant_name.updateValue(creds.tenant_name);
      this.default.updateValue(creds.default);
   }

   addNew() {
      this.editMode = true;
      this.currentObject = null;
      // Clear form values
      this.setFormValues(new OpenStackCredentials());
   }

   editExisting(creds : OpenStackCredentials) {
      this.editMode = true;
      this.currentObject = creds;
      this.setFormValues(creds);
   }

   cancelEdit() {
      this.editMode = false;
      this.currentObject = null;
      // Clear form values
      this.setFormValues(new OpenStackCredentials());
   }
   
   isEditing() : boolean {
      return this.editMode && this.currentObject != null;
   }

   deleteCreds(creds: OpenStackCredentials) {
      this._profileService.deleteCredentialsOpenStack(creds)
         .subscribe(result => {
            this._profileService.getProfile().subscribe(result => {
               this.profile = result;
            });
         });
   }

   saveEdit() {
      // Switch value to id before submit 
      let currentCloudSelection = this.cred_cloud.value;
      this.cred_cloud.updateValue(currentCloudSelection.id);
      if (this.currentObject) {
         this._profileService.saveCredentialsOpenStack(this.openstackCredentialsForm.value)
            .subscribe(result => {
               this._profileService.getProfile().subscribe(result => {
                  this.profile = result;
                  this.editMode = false;
               });
            });
      }
      else {
         this._profileService.createCredentialsOpenStack(this.openstackCredentialsForm.value)
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
