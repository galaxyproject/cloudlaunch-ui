import { Component, OnInit } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators } from '@angular/forms';

import { UserProfile } from '../../../shared/models/profile';
import { ProfileService } from '../../../shared/services/profile.service';

@Component({
   selector: 'userprofile',
   templateUrl: './userprofile.component.html'
})
export class UserProfileComponent implements OnInit {
   profile: UserProfile = null;
   
   profileForm: FormGroup;
   username: FormControl = new FormControl(null, Validators.required);
   email: FormControl = new FormControl(null, Validators.required);
   first_name: FormControl = new FormControl(null);
   last_name: FormControl = new FormControl(null);
   
   
   constructor(
      private _profileService: ProfileService,
      fb: FormBuilder) {
      this.profileForm = fb.group({
         'username': this.username,
         'email': this.email,
         'first_name': this.first_name,
         'last_name': this.last_name,
      });

   }

   ngOnInit() {
      this._profileService.getProfile().subscribe(profile => this.setFormValues(profile));
   }
   
   setFormValues(profile : UserProfile) {
      this.profile = profile;
      this.username.setValue(profile.username);
      this.email.setValue(profile.email);
      this.first_name.setValue(profile.first_name);
      this.last_name.setValue(profile.last_name);
   }

}
