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

import { UserProfile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { StandardLayoutComponent } from '../../layouts/standard-layout.component';

@Component({
   selector: 'openstack-credentials',
   templateUrl: 'app/components/credentials/openstack-credentials.component.html',
   directives: [StandardLayoutComponent, ROUTER_DIRECTIVES, NgSwitch, NgSwitchDefault],
   providers: [ProfileService],
   inputs: ['profile']
})
export class OpenStackCredentialsComponent implements OnInit {
   profile: UserProfile;

   openstackCredentialsForm: ControlGroup;
   
   username: Control = new Control(null, Validators.required);
   email: Control = new Control(null, Validators.required);
   first_name: Control = new Control(null);
   last_name: Control = new Control(null);
   
   
   constructor(
      private _router: Router,
      private _profileService: ProfileService,
      fb: FormBuilder) {
      this.openstackCredentialsForm = fb.group({
         'username': this.username,
         'email': this.email,
         'first_name': this.first_name,
         'last_name': this.last_name,
      });

   }

   ngOnInit() {
      //this._profileService.getProfile().subscribe(profile => this.setFormValues(profile));
   }
   
   setFormValues(profile : UserProfile) {
      this.profile = profile;
      this.username.updateValue(profile.username);
      this.email.updateValue(profile.email);
      this.first_name.updateValue(profile.first_name);
      this.last_name.updateValue(profile.last_name);
   }

}
