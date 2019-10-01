import { Component, OnInit } from '@angular/core';
import { NgSwitch, NgSwitchDefault } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';

import { UserProfile } from '../../../shared/models/profile';
import { ProfileService } from '../../../shared/services/profile.service';

@Component({
    selector: 'clui-user-profile',
    templateUrl: './userprofile.component.html'
})
export class UserProfileComponent {
    profileChanged = new Subject();
    profileObs: Observable<UserProfile>;

    // Form Controls
    profileForm: FormGroup;
    username: FormControl = new FormControl({ value: null, disabled: true }, Validators.required);
    email: FormControl = new FormControl(null, Validators.required);
    first_name: FormControl = new FormControl(null);
    last_name: FormControl = new FormControl(null);


    constructor(
        private profileService: ProfileService,
        fb: FormBuilder) {
        this.profileForm = fb.group({
            'username': this.username,
            'email': this.email,
            'first_name': this.first_name,
            'last_name': this.last_name,
        });
        this.profileObs = this.profileChanged.pipe(
                              startWith(null as string),
                              switchMap(() => this.profileService.getProfile()),
                              tap(profile => this.profileForm.patchValue(profile)));
    }
}
