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
import { ProfileService } from '../../../shared/services/profile.service';

const CREDENTIALS_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CloudCredentialsSelectorComponent),
    multi: true
};

const CREDENTIALS_CONTROL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CloudCredentialsSelectorComponent),
    multi: true
};

enum CredentialsType {
    SAVED,
    TEMPORARY
}

@Component({
    selector: 'clui-cloud-credentials-selector',
    templateUrl: './cloud-credentials-selector.component.html',
    providers: [CREDENTIALS_CONTROL_ACCESSOR, CREDENTIALS_CONTROL_VALIDATOR]
})
export class CloudCredentialsSelectorComponent implements OnInit, ControlValueAccessor, Validator {

    public credentialsType = CredentialsType;
    public errorMessage: string;
    storedCredentials: Credentials[];

    @Input()
    set cloud(cloud: Cloud) {
        this.cloudCtrl.patchValue(cloud);
    }
    get cloud() { return this.cloudCtrl.value; }

    @Output()
    credentialsChanged = new EventEmitter<Credentials>();

    // Form Controls
    credentialsSelectionForm: FormGroup;
    credTypeCtrl: FormControl = new FormControl(CredentialsType.SAVED, Validators.required);
    storedCredCtrl: FormControl = new FormControl('');
    tempCredCtrl: FormControl = new FormControl('');

    // Disconnected Form Controls
    cloudCtrl: FormControl = new FormControl('');

    // implementation of ControlValueAccessor

    // the method set in registerOnChange, it is just
    // a placeholder for a method that takes one parameter,
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj && obj.id) {
            this.storedCredCtrl.patchValue(obj);
        } else {
            this.tempCredCtrl.patchValue(obj);
        }
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.credentialsSelectionForm.disable();
        } else {
            this.credentialsSelectionForm.enable();
        }
    }
    // End: implementation of ControlValueAccessor

    // Begin: implementation of Validator interface
    public validate(c: FormControl) {
        // Delegate to form
        if (this.credTypeCtrl.value === CredentialsType.SAVED &&
            this.storedCredCtrl.valid) {
            return null;
        } else if (this.credTypeCtrl.value === CredentialsType.TEMPORARY &&
            this.tempCredCtrl.valid) {
            return null;
        } else {
            return { 'credentials_selector': 'invalid' };
        }
    }

    // End: implementation of Validator interface
    constructor(
        private _profileService: ProfileService,
        fb: FormBuilder) {
        this.credentialsSelectionForm = fb.group({
            'credential_type': this.credTypeCtrl,
            'credentials': this.storedCredCtrl,
            'temporary_credentials': this.tempCredCtrl,
        });
        this.credTypeCtrl.valueChanges.subscribe(data => this.handleCredentialChange());
        this.storedCredCtrl.valueChanges.subscribe(data => this.handleCredentialChange());
        this.tempCredCtrl.valueChanges.subscribe(data => this.handleCredentialChange());
        this.cloudCtrl.valueChanges.subscribe(cloud => this.retrieveStoredCredentials(cloud, null));

    }

    isSameCredential(c1: Credentials, c2: Credentials): boolean {
        return c1 && c2 && c1.id === c2.id;
    }

    ngOnInit() {
        // Trigger initial fetch of creds
        this.cloudCtrl.updateValueAndValidity();
    }

    handleCredentialChange() {
        if (this.credTypeCtrl.value === CredentialsType.SAVED) {
            this.notifyCredentialsChanged(this.storedCredCtrl.value);
        } else {
            this.notifyCredentialsChanged(this.tempCredCtrl.value);
        }
    }

    notifyCredentialsChanged(creds: Credentials) {
        this.propagateChange(creds);
        this.credentialsChanged.emit(creds);
    }

    handleTempCredChange(creds: Credentials) {
        if (creds && creds.id) {
            // Has an id, must have been saved to profile
            this.retrieveStoredCredentials(creds.cloud, creds);
        } else {
            this.tempCredCtrl.setValue(creds);
        }
    }

    retrieveStoredCredentials(cloud: Cloud, selectedCreds: Credentials) {
        this._profileService.getCredentialsForCloud(cloud.id)
            .subscribe(creds => this.handleRetrievedCredentials(creds, selectedCreds),
            error => this.errorMessage = <any>error);
    }

    handleRetrievedCredentials(creds: Credentials[], selectedCreds: Credentials) {
        this.storedCredentials = creds;
        if (creds && creds.length > 0) { // Activate the correct tab
            this.credTypeCtrl.setValue(CredentialsType.SAVED);
            this.credTypeCtrl.enable();
            if (selectedCreds) {
                this.storedCredCtrl.setValue(selectedCreds);
            } else {
                const defaultCreds = creds.filter(c => c.default === true);
                if (defaultCreds) {
                    this.storedCredCtrl.setValue(defaultCreds[0]);
                } else if (creds.length === 1) {
                    this.storedCredCtrl.setValue(creds[0]);
                }
            }
        } else {
            this.credTypeCtrl.setValue(CredentialsType.TEMPORARY);
            // User has no saved credentials, so disable the tab
            this.credTypeCtrl.disable();
            this.tempCredCtrl.patchValue(null);
            this.storedCredCtrl.patchValue(null);
        }
    }

}
