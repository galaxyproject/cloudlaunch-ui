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
    selector: 'cloud-credentials-selector',
    templateUrl: './cloud-credentials-selector.component.html',
    providers: [CREDENTIALS_CONTROL_ACCESSOR, CREDENTIALS_CONTROL_VALIDATOR]
})
export class CloudCredentialsSelectorComponent implements OnInit, ControlValueAccessor, Validator {
    
    public credentialsType = CredentialsType;
    credentialsSelectionForm: FormGroup;
    public errorMessage: string;
    _currentCloud: Cloud;
    storedCredentials: Credentials[] = [];
    selectedCredentials: Credentials;
    storedCredentialsHelp: string = 'Select a target cloud first';

    @Input()
    set cloud(cloud: Cloud) {
        this._currentCloud = cloud;
        this.getStoredCredentials(cloud, null);
    }
    get cloud() { return this._currentCloud; }
    
    @Output()
    onCredentialsChanged = new EventEmitter<Credentials>();

    // Form Controls
    ctrl_credentials_type: FormControl = new FormControl(CredentialsType.TEMPORARY, Validators.required);
    ctrl_stored_credentials: FormControl = new FormControl('');
    ctrl_temporary_credentials: FormControl = new FormControl('');
    

    // implementation of ControlValueAccessor

    // the method set in registerOnChange, it is just 
    // a placeholder for a method that takes one parameter, 
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj && obj.id) {
            this.ctrl_credentials_type.setValue(CredentialsType.SAVED);
            this.ctrl_stored_credentials.patchValue(obj);
        }
        else {
            this.ctrl_credentials_type.setValue(CredentialsType.TEMPORARY);
            this.ctrl_temporary_credentials.patchValue(obj);
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
        if (this.ctrl_credentials_type.value == CredentialsType.SAVED &&
            this.ctrl_stored_credentials.valid)
            return null;
        else if (this.ctrl_credentials_type.value == CredentialsType.TEMPORARY &&
            this.ctrl_temporary_credentials.valid)
            return null;
        else
            return { 'credentials_selector': 'invalid' };
    }

    // End: implementation of Validator interface
    constructor(
        private _profileService: ProfileService,
        private _cloudService: CloudService,
        fb: FormBuilder) {
        this.credentialsSelectionForm = fb.group({
            'credential_type': this.ctrl_credentials_type,
            'credentials': this.ctrl_stored_credentials,
            'temporary_credentials': this.ctrl_temporary_credentials,
        });
        this.ctrl_credentials_type.valueChanges.subscribe(data => { this.handleCredentialChange(); });
        this.ctrl_stored_credentials.valueChanges.subscribe(data => { this.handleCredentialChange(); });
        this.ctrl_temporary_credentials.valueChanges.subscribe(data => { this.handleCredentialChange(); });
    }

    ngOnInit() {
    }

    handleCredentialChange() {
        if (this.ctrl_credentials_type.value == CredentialsType.SAVED)
            this.notifyCredentialsChanged(this.ctrl_stored_credentials.value);
        else {
            this.notifyCredentialsChanged(this.ctrl_temporary_credentials.value);
        }
    }


    notifyCredentialsChanged(creds: Credentials) {
        this.propagateChange(creds);
        this.onCredentialsChanged.emit(creds);
    }

    handleTempCredChange(creds: Credentials) {
        if (creds && creds.id) {
            // Has an id, must have been saved to profile
            this.getStoredCredentials(creds.cloud, creds);
        }
        else
            this.ctrl_temporary_credentials.setValue(creds);
    }

    getStoredCredentials(cloud: Cloud, highlight_creds: Credentials) {
        this.storedCredentialsHelp = 'Retrieving stored credentials...';
        this.storedCredentials = [];
        this._profileService.getCredentialsForCloud(cloud.slug)
            .subscribe(creds => this.processStoredCredentials(creds, highlight_creds),
            error => console.log(<any>error),
            () => { this.storedCredentialsHelp = 'Select Credentials'; });
    }

    getSelectedCredentials() {
        if (this.ctrl_stored_credentials.value) {
            return [this.ctrl_stored_credentials.value];
        }
        return null;
    }

    processStoredCredentials(creds: Credentials[], highlight_creds: Credentials) {
        if (creds)
            this.storedCredentials = creds.map((c: any) => { c.text = c.name; return c; });
        if (this.storedCredentials && this.storedCredentials.length > 0) { // Activate the correct tab
            this.ctrl_credentials_type.setValue(CredentialsType.SAVED);
            if (highlight_creds) {
                highlight_creds.text = highlight_creds.name; // Adjustments to keep ng2 select happy
                this.ctrl_stored_credentials.setValue(highlight_creds);
            }
            else {
                let defaultCreds = this.storedCredentials.filter(c => c.default === true);
                if (defaultCreds)
                    this.ctrl_stored_credentials.setValue(defaultCreds[0]);
            }
        } else {
            this.ctrl_credentials_type.setValue(CredentialsType.TEMPORARY);
            this.ctrl_stored_credentials.patchValue(null);
        }
    }

    onCredentialsSelect(creds: Credentials) {
        if (this.storedCredentials && creds) {
            creds = this.storedCredentials.filter(c => c.id === creds.id)[0];
        }
        this.ctrl_stored_credentials.setValue(creds);
    }

}
