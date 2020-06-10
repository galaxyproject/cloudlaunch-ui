import { Component, forwardRef, Input } from '@angular/core';
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
import { OpenStackCloud } from '../../../../shared/models/cloud';


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
    selector: 'clui-openstack-cred-editor',
    templateUrl: './openstack-cred-editor.component.html',
    providers: [OPENSTACK_CREDENTIALS_CONTROL_ACCESSOR, OPENSTACK_CREDENTIALS_CONTROL_VALIDATOR]
})
export class OpenStackCredEditorComponent implements ControlValueAccessor, Validator {
    openstackCredentialsForm: FormGroup;
    showPassword = false;

    @Input() cloud: OpenStackCloud;

    // Form Controls
    usernameCtrl: FormControl = new FormControl(null, Validators.required);
    passwordCtrl: FormControl = new FormControl(null, Validators.required);
    projectNameCtrl: FormControl = new FormControl(null, Validators.required);
    projectDomainIdCtrl: FormControl = new FormControl(null);
    projectDomainNameCtrl: FormControl = new FormControl(null);
    userDomainNameCtrl: FormControl = new FormControl(null);

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

    constructor(fb: FormBuilder) {
        this.openstackCredentialsForm = fb.group({
            'os_username': this.usernameCtrl,
            'os_password': this.passwordCtrl,
            'os_project_name': this.projectNameCtrl,
            'os_project_domain_id': this.projectDomainIdCtrl,
            'os_project_domain_name': this.projectDomainNameCtrl,
            'os_user_domain_name': this.userDomainNameCtrl,
        });
        this.openstackCredentialsForm.valueChanges.subscribe(data => this.propagateChange(data));
    }

}
