import { Component, OnInit, EventEmitter, Input, Output, forwardRef } from '@angular/core';
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
import { Cloud } from '../../../shared/models/cloud';
import { Credentials } from '../../../shared/models/profile';

// services
import { CloudService } from '../../../shared/services/cloud.service';
import { ProfileService } from '../../../shared/services/profile.service';

const CREDENTIALS_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CloudCredentialsEditorComponent),
    multi: true
};

const CREDENTIALS_CONTROL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CloudCredentialsEditorComponent),
    multi: true
};

@Component({
    selector: 'cloud-credentials-editor',
    templateUrl: './cloud-credentials-editor.component.html',
    providers: [CREDENTIALS_CONTROL_ACCESSOR, CREDENTIALS_CONTROL_VALIDATOR]
})
export class CloudCredentialsEditorComponent implements OnInit, ControlValueAccessor, Validator {
    allowCloudChange: boolean = true;
    credentialsForm: FormGroup;
    availableClouds: Cloud[];
    errorMessage: string;
    private _saveIsOptional: boolean = false;
    saveIsPressed: boolean = false;
    // Form Controls
    ctrl_id: FormControl = new FormControl(null);
    ctrl_name: FormControl = new FormControl(null, Validators.required);
    ctrl_default: FormControl = new FormControl(null);
    ctrl_cloud: FormControl = new FormControl(null, Validators.required);
    ctrl_creds: FormControl = new FormControl(null, Validators.required);


    @Input()
    set credentials(creds: Credentials) {
        if (creds) {
            this.credentialsForm.patchValue(creds);
            this.ctrl_creds.patchValue(creds);
            if (creds.cloud) {
                this.onCloudSelect(creds.cloud);
            }
        } else {
            this.credentialsForm.patchValue(new Credentials());
        }
    }
    get credentials(): Credentials {
        return this.formDataToCredentials(this.credentialsForm.value);
    }

    formDataToCredentials(data): Credentials {
        let creds: Credentials = Object.assign({}, data);
        if (data && data.credentials) {
            Object.assign(creds, data.credentials);
        }
        return creds;
    }

    @Input()
    set cloud(cloud: Cloud) {
        this.allowCloudChange = false;
        this.onCloudSelect(cloud);
    }
    get cloud() { return this.ctrl_cloud.value; }


    @Input()
    set saveIsOptional(isOptional: boolean) {
        this._saveIsOptional = isOptional;
        this.ctrl_name.disable();
    }
    get saveIsOptional() { return this._saveIsOptional; }

    // implementation of ControlValueAccessor

    // the method set in registerOnChange, it is just 
    // a placeholder for a method that takes one parameter, 
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        this.credentials = obj;
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.credentialsForm.disable();
        } else {
            this.credentialsForm.enable();
        }
    }
    // End: implementation of ControlValueAccessor

    // Begin: implementation of Validator interface
    public validate(c: FormControl) {
        // Delegate to form
        if (this.credentialsForm.valid) {
            return null;
        } else {
            return { 'credentials': 'invalid' };
        }
    }

    // End: implementation of Validator interface
    constructor(
        private _profileService: ProfileService,
        private _cloudService: CloudService,
        fb: FormBuilder) {
        this.credentialsForm = fb.group({
            'id': this.ctrl_id,
            'name': this.ctrl_name,
            'default': this.ctrl_default,
            'cloud': this.ctrl_cloud,
            'credentials': this.ctrl_creds
        });
        this.credentialsForm.valueChanges.subscribe(data => { this.handleCredentialsChanged(this.formDataToCredentials(data)); });
    }

    ngOnInit() {
        this._cloudService.getClouds().subscribe(
            clouds => this.availableClouds = clouds.map(t => { return this.ng2SelectAdjust(t); }),
            error => this.errorMessage = <any>error);
        this.onCloudSelect(this.cloud);
    }


    onCloudSelect(cloud: any) {
        if (this.availableClouds && cloud) {
            let matching_cloud = this.availableClouds.filter(c => c.slug === cloud.slug);
            this.ctrl_cloud.setValue(matching_cloud[0]);
        } else {
            this.ng2SelectAdjust(cloud);
            this.ctrl_cloud.setValue(cloud);
        }
    }

    getSelectedCloud() {
        if (this.ctrl_cloud.value) {
            return [this.ctrl_cloud.value];
        }
        return null;
    }

    ng2SelectAdjust(cloud: Cloud) {
        // Satisfy ng2-select requirements
        if (cloud) {
            cloud.id = cloud.slug;
            cloud.text = cloud.name;
        }
        return cloud;
    }

    handleCredentialsChanged(creds: Credentials) {
        this.propagateChange(creds);
    }

    setSaveIsPressed() {
        this.ctrl_name.enable();
        this.saveIsPressed = true;
    }

    cancelEdit() {
        // Clear form values
        if (this.saveIsOptional) {
            this.saveIsPressed = false;
            this.ctrl_name.disable();
        } else {
            this.credentialsForm.reset();
            this.handleCredentialsChanged(this.credentialsForm.value);
        }
    }

    saveEdit() {
        let creds = <any>this.credentials;

        if (creds.id) { // Has an id, therefore, it's an existing record
            switch (this.cloud.cloud_type) {
                case 'aws':
                    this._profileService.saveCredentialsAWS(creds)
                        .subscribe(result => { this.handleCredentialsChanged(creds); });
                    break;
                case 'openstack':
                    this._profileService.saveCredentialsOpenStack(creds)
                        .subscribe(result => { this.handleCredentialsChanged(creds); });
                    break;
            }

        } else { // Must be a new record
            switch (this.cloud.cloud_type) {
                case 'aws':
                    this._profileService.createCredentialsAWS(creds)
                        .subscribe(result => { this.handleCredentialsChanged(creds); });
                    break;
                case 'openstack':
                    this._profileService.createCredentialsOpenStack(creds)
                        .subscribe(result => { this.handleCredentialsChanged(creds); });
                    break;
            }
        }
        if (this.saveIsOptional) {
            this.saveIsPressed = false;
            this.ctrl_name.disable();
        }
    }
}
