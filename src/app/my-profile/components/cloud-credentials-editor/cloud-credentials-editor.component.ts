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
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/distinctUntilChanged';
import { map, mergeMap, startWith } from 'rxjs/operators';

// models
import { Cloud } from '../../../shared/models/cloud';
import { Credentials, AWSCredentials, OpenStackCredentials, AzureCredentials } from '../../../shared/models/profile';

// services
import { CloudService } from '../../../shared/services/cloud.service';
import { ProfileService } from '../../../shared/services/profile.service';

// utils
import { CredentialParser } from './credential-parser';

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

declare type VerificationSuccessCallback = (c: Credentials) => void;
declare type VerificationFailureCallback = (c: Credentials, error: string) => void;

@Component({
    selector: 'cloud-credentials-editor',
    templateUrl: './cloud-credentials-editor.component.html',
    providers: [CREDENTIALS_CONTROL_ACCESSOR, CREDENTIALS_CONTROL_VALIDATOR]
})
export class CloudCredentialsEditorComponent implements OnInit, ControlValueAccessor, Validator {
    allowCloudChange: boolean = true;
    errorMessage: string;
    _saveIsOptional: boolean = false;
    saveIsPressed: boolean = false;
    useCredsIsPressed: boolean = false;
    credVerificationInProgress = false;

    // Form Controls
    credentialsForm: FormGroup;
    idCtrl: FormControl = new FormControl(null);
    nameCtrl: FormControl = new FormControl(null, Validators.required);
    defaultCtrl: FormControl = new FormControl(null);
    cloudCtrl: FormControl = new FormControl(null, Validators.required);
    credentialTermsCtrl: FormControl = new FormControl(null, this.validateCredentialsTerms);

    // Form controls disconnected from the main FormGroup
    cloudTypeCtrl: FormControl = new FormControl(null);
    awsCredsCtrl: FormControl = new FormControl(null, Validators.required);
    openstackCredsCtrl: FormControl = new FormControl(null, Validators.required);
    azureCredsCtrl: FormControl = new FormControl(null, Validators.required);

    // Observables
    filteredCloudTypes: Observable<Cloud[]>;

    @Input()
    set credentials(creds: Credentials) {
        if (creds) {
            this.cloudCtrl.patchValue(creds.cloud);
            this.credentialsForm.patchValue(creds);
            if (this.getActiveProviderEditor())
                this.getActiveProviderEditor().patchValue(creds);
        }
        else {
            this.cancelUseCredentials(null, null, true);
        }
    }
    get credentials(): Credentials {
        return this.formDataToCredentials(this.credentialsForm.value);
    }

    formDataToCredentials(data: any): Credentials {
        let creds = new Credentials();
        creds.id = this.idCtrl.value;
        creds.name = this.nameCtrl.value;
        creds.default = this.defaultCtrl.value;
        creds.cloud = this.cloudCtrl.value;
        if (data && data.provider_editor) {
            Object.assign(creds, data.provider_editor);
        }
        return creds;
    }

    @Input()
    set cloud(cloud: Cloud) {
        this.allowCloudChange = false;
        this.cloudCtrl.patchValue(cloud);
    }
    get cloud() { return this.cloudCtrl.value; }

    @Input()
    set cloudType(providerId: string) {
        this.cloudTypeCtrl.patchValue(providerId);
    }
    get cloudType() { return this.cloudTypeCtrl.value; }

    getActiveProviderEditor() : FormControl {
        return (<FormControl>this.credentialsForm.controls["provider_editor"]);
    }

    @Input()
    set saveIsOptional(isOptional: boolean) {
        this._saveIsOptional = isOptional;
        this.nameCtrl.disable();
        this.credentialTermsCtrl.disable()
    }
    get saveIsOptional() { return this._saveIsOptional; }

    @Output()
    onCredentialsChanged = new EventEmitter<Credentials>();

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
        if (this.credentialsForm.disabled || this.credentialsForm.valid) {
            return null;
        } else {
            return { 'credentials_editor': 'invalid' };
        }
    }
    // End: implementation of Validator interface

    constructor(
        private _profileService: ProfileService,
        private _cloudService: CloudService,
        fb: FormBuilder) {
        this.credentialsForm = fb.group({
            'id': this.idCtrl,
            'name': this.nameCtrl,
            'default': this.defaultCtrl,
            'cloud': this.cloudCtrl,
            'credential_terms': this.credentialTermsCtrl
        });
        this.cloudCtrl.valueChanges.distinctUntilChanged().subscribe(cloud => this.onCloudChanged(cloud));
        this.cloudTypeCtrl.valueChanges.subscribe(cloudType => this.onCloudTypeChanged(cloudType));
    }

    ngOnInit() {
        // shareReplay so that the cloud call is made only once
        let cloudObservable = this._cloudService.getClouds().shareReplay(1);
        // this.cloudTypeCtrl.value has a value only after initial properties are set, so initialize
        // here on ngOnInit() instead of in constructor
        this.filteredCloudTypes = this.cloudTypeCtrl.valueChanges
                                    .startWith(this.cloudTypeCtrl.value)
                                    .mergeMap(cloudType => cloudObservable.map(c => this.getCloudsForType(cloudType, c)));
    }

    isSameCloud(c1: Cloud, c2: Cloud) : boolean {
        return c1 && c2 && c1.slug == c2.slug;
    }

    onCloudChanged(cloud: Cloud) {
        if (cloud) {
            this.cloudType = cloud.cloud_type;
        }
        this.saveIsPressed = false;
        this.useCredsIsPressed = false;
    }

    getCloudsForType(cloudType: any, cloudList: Cloud[]) {
        if (cloudType)
            return cloudList.filter(c => c.cloud_type == cloudType);
         else
            return cloudList;
    }

    getEditorFor(cloudType: string) {
        if (cloudType == "aws")
            return this.awsCredsCtrl;
        else if (cloudType == "azure")
            return this.azureCredsCtrl;
        else if (cloudType == "openstack")
            return this.openstackCredsCtrl;
        else
            return null;
    }

    onCloudTypeChanged(cloudType: string) {
        this.credentialsForm.setControl('provider_editor', this.getEditorFor(cloudType));
    }

    handleCredentialsFinalised(creds: Credentials) {
        this.credentials = creds;
        this.propagateChange(creds);
        this.onCredentialsChanged.emit(creds);
    }

    useCredentials() {
        this.verifyCredentials(
                this.credentials,
                (creds) => { this.continueUseCredentials(creds); },
                (creds, error) => { this.cancelUseCredentials(creds, error); });
    }

    verifyCredentials(creds: any, successCallBack: VerificationSuccessCallback,
            failureCallBack: VerificationFailureCallback) {
        this.errorMessage = null;
        this.credVerificationInProgress = true;
        switch (this.cloud.cloud_type) {
            case 'aws':
                this._profileService.verifyCredentialsAWS(creds)
                    .subscribe(result => { this.handleVerificationResult(creds, result, successCallBack, failureCallBack); },
                               error => { this.handleVerificationFailure(creds, error, failureCallBack); });
                break;
            case 'openstack':
                this._profileService.verifyCredentialsOpenStack(creds)
                    .subscribe(result => { this.handleVerificationResult(creds, result, successCallBack, failureCallBack); },
                               error => { this.handleVerificationFailure(creds, error, failureCallBack); });
                break;
            case 'azure':
                this._profileService.verifyCredentialsAzure(creds)
                    .subscribe(result => { this.handleVerificationResult(creds, result, successCallBack, failureCallBack); },
                               error => { this.handleVerificationFailure(creds, error, failureCallBack); });
                break;
        }
    }

    handleVerificationResult(creds: Credentials, result: any, successCallback: VerificationSuccessCallback,
            failureCallback: VerificationFailureCallback) {
        this.credVerificationInProgress = false;
        if (result.result === "SUCCESS") {
            successCallback(creds);
        }
        else
            this.handleVerificationFailure(creds, "The credentials you have entered are invalid.", failureCallback)
    }

    handleVerificationFailure(creds: Credentials, error: any, failureCallback: VerificationFailureCallback) {
        this.credVerificationInProgress = false;
        this.errorMessage = error;
        failureCallback(creds, error);
    }

    continueUseCredentials(creds: Credentials) {
        this.useCredsIsPressed = true;
        this.credentialsForm.disable();
        this.nameCtrl.disable();
        this.credentialTermsCtrl.disable()
        this.handleCredentialsFinalised(creds);
    }

    cancelUseCredentials(creds: Credentials, error: string, suppressEvent?: boolean) {
        this.useCredsIsPressed = false;
        this.credentialsForm.enable();
        if (this.saveIsOptional) {
            this.nameCtrl.disable();
            this.credentialTermsCtrl.disable();
        }
        else {
            this.nameCtrl.enable();
            this.credentialTermsCtrl.enable();
        }
        if (!suppressEvent)
            this.handleCredentialsFinalised(null);
    }

    setSaveIsPressed() {
        this.nameCtrl.enable();
        this.credentialTermsCtrl.enable()
        this.saveIsPressed = true;
    }

    cancelEdit() {
        // Clear form values
        if (this.saveIsOptional) {
            this.saveIsPressed = false;
            this.nameCtrl.disable();
            this.credentialTermsCtrl.disable()
        } else {
            this.credentialsForm.reset();
            this.handleCredentialsFinalised(null);
        }
    }

    validateCredentialsTerms(control: FormControl) {
        if (!control.value)
            return {"terms_not_accepted": true}
    }

    loadCredentialsFromFile($event: Event) {
        let file = (<HTMLInputElement>$event.target).files[0];
        if (file) {
            let parser = new CredentialParser(this.cloudCtrl.value.cloud_type);
            parser.loadCredentialsFromFile(
                    (<HTMLInputElement>$event.target).files[0],
                    (creds) => this.handleLoadedCredentials(creds));
        }
    }

    handleLoadedCredentials(creds: Credentials) {
        if (creds instanceof AWSCredentials) {
            this.awsCredsCtrl.patchValue(creds);
        }
        else if (creds instanceof AzureCredentials) {
            this.azureCredsCtrl.patchValue(creds);
        }
        else if (creds instanceof OpenStackCredentials) {
            this.openstackCredsCtrl.patchValue(creds);
        }
    }

    saveEdit() {
        let creds = <Credentials>this.credentials;
        creds.cloud_id = creds.cloud.slug;
        creds.default = creds.default || false;

        this.verifyCredentials(
                creds,
                (creds) => { this.continueSaveCredentials(creds); },
                (creds, error) => { this.endSaveCredentials(creds, error); });
    }

    continueSaveCredentials(creds: Credentials) {
        if (creds.id) { // Has an id, therefore, it's an existing record
            switch (this.cloudTypeCtrl.value) {
                case 'aws':
                    this._profileService.saveCredentialsAWS(<AWSCredentials>creds)
                        .subscribe(result => this.handleCredentialsFinalised(result));
                    break;
                case 'openstack':
                    this._profileService.saveCredentialsOpenStack(<OpenStackCredentials>creds)
                        .subscribe(result => this.handleCredentialsFinalised(result));
                    break;
                case 'azure':
                    this._profileService.saveCredentialsAzure(<AzureCredentials>creds)
                        .subscribe(result => this.handleCredentialsFinalised(result));
                    break;
            }

        } else { // Must be a new record
            switch (this.cloudTypeCtrl.value) {
                case 'aws':
                    this._profileService.createCredentialsAWS(<AWSCredentials>creds)
                        .subscribe(result => this.handleCredentialsFinalised(result));
                    break;
                case 'openstack':
                    this._profileService.createCredentialsOpenStack(<OpenStackCredentials>creds)
                        .subscribe(result => this.handleCredentialsFinalised(result));
                    break;
                case 'azure':
                    this._profileService.createCredentialsAzure(<AzureCredentials>creds)
                        .subscribe(result => this.handleCredentialsFinalised(result));
                    break;
            }
        }
        this.endSaveCredentials(creds, null);
    }

    endSaveCredentials(creds: Credentials, error: string) {
        if (this.saveIsOptional) {
            this.saveIsPressed = false;
            this.nameCtrl.disable();
            this.credentialTermsCtrl.disable()
        }
    }
}
