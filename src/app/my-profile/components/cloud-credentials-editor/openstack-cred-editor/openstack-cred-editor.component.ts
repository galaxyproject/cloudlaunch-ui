import { Component, forwardRef } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    NG_VALUE_ACCESSOR,
    ControlValueAccessor,
    NG_VALIDATORS,
    Validator
} from '@angular/forms';

// models
import { Cloud } from '../../../../shared/models/cloud';

// services
import { CloudService } from '../../../../shared/services/cloud.service';

const OPENSTACK_CREDENTIALS_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OpenStackCredEditorComponent),
    multi: true
};

const OPENSTACK_CREDENTIALS_CONTROL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => OpenStackCredEditorComponent),
    multi: true
};

@Component({
    selector: 'openstack-cred-editor',
    templateUrl: './openstack-cred-editor.component.html',
    providers: [OPENSTACK_CREDENTIALS_CONTROL_ACCESSOR, OPENSTACK_CREDENTIALS_CONTROL_VALIDATOR]
})
export class OpenStackCredEditorComponent implements ControlValueAccessor, Validator {
    openstackCredentialsForm: FormGroup;
    availableClouds: Cloud[];

    // Form Controls
    username: FormControl = new FormControl(null, Validators.required);
    password: FormControl = new FormControl(null, Validators.required);
    project_name: FormControl = new FormControl(null, Validators.required);
    project_domain_name: FormControl = new FormControl(null);
    user_domain_name: FormControl = new FormControl(null);

    // Begin: implementation of ControlValueAccessor

    // the method set in registerOnChange, it is just 
    // a placeholder for a method that takes one parameter, 
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj) {
            this.openstackCredentialsForm.patchValue(obj);
        } else {
            this.openstackCredentialsForm.reset();
        }
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.openstackCredentialsForm.disable();
        } else {
            this.openstackCredentialsForm.enable();
        }
    }
    // End: implementation of ControlValueAccessor

    // Begin: implementation of Validator interface
    public validate(c: FormControl) {
        // Delegate to form
        if (this.openstackCredentialsForm.disabled || this.openstackCredentialsForm.valid) {
            return null;
        } else {
            return { 'openstack_credentials': 'invalid' };
        }
    }
    // End: implementation of Validator interface

    constructor(
        private _cloudService: CloudService,
        fb: FormBuilder) {
        this.openstackCredentialsForm = fb.group({
            'username': this.username,
            'password': this.password,
            'project_name': this.project_name,
            'project_domain_name': this.project_domain_name,
            'user_domain_name': this.user_domain_name,
        });
        this.openstackCredentialsForm.valueChanges.subscribe(data => this.propagateChange(data));
    }

}
