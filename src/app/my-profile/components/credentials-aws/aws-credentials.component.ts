import { Component, OnInit, Input } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import {
   FormBuilder,
   FormGroup,
   FormControl,
   Validators } from '@angular/forms';

// models
import { UserProfile } from '../../../shared/models/profile';
import { AWSCredentials } from '../../../shared/models/profile';
import { Cloud } from '../../../shared/models/cloud';

// services
import { ProfileService } from '../../../shared/services/profile.service';
import { CloudService } from '../../../shared/services/cloud.service';


@Component({
   selector: 'aws-credentials',
   templateUrl: './aws-credentials.component.html',
   inputs: ['profile']
})
export class AWSCredentialsComponent implements OnInit {
   errorMessage: string;
   profile: UserProfile;
   clouds: Cloud[];

   awsCredentialsForm: FormGroup;
   editMode: boolean = false;
   currentObject: AWSCredentials; 
   
   cred_id: FormControl = new FormControl(null);
   cred_name: FormControl = new FormControl(null, Validators.required);
   cred_cloud: FormControl = new FormControl(null, Validators.required);
   access_key: FormControl = new FormControl(null, Validators.required);
   secret_key: FormControl = new FormControl(null, Validators.required);
   default: FormControl = new FormControl(null);
   
   constructor(
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
      let matching_cloud = this.clouds.filter(c => c.slug == cloud.id);
      this.cred_cloud.setValue(matching_cloud[0]);
   }

   getSelectedCloud() {
      if (this.clouds && this.cred_cloud.value)
         return this.clouds.filter(c => c.id == this.cred_cloud.value.id);
      else
         return null;
   }

   setFormValues(creds: AWSCredentials) {
      this.cred_id.setValue(creds.id);
      this.cred_name.setValue(creds.name);
      if (creds.cloud) { // Satisfy ng2-select requirements
         creds.cloud.id = creds.cloud.slug;
         creds.cloud.text = creds.cloud.name;
      }
      this.cred_cloud.setValue(creds.cloud);
      this.access_key.setValue(creds.access_key);
      this.secret_key.setValue(creds.secret_key);
      this.default.setValue(creds.default);
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

   isEditing() : boolean {
      return this.editMode && this.currentObject != null;
   }

   deleteCreds(creds: AWSCredentials) {
      this._profileService.deleteCredentialsAWS(creds)
         .subscribe(result => {
            this._profileService.getProfile().subscribe(result => {
               this.profile = result;
            });
         });
   }

   saveEdit() {
      // Switch value to id before submit 
      let currentCloudSelection = this.cred_cloud.value;
      this.cred_cloud.setValue(currentCloudSelection.id);
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
      this.cred_cloud.setValue(currentCloudSelection);
   }
}
