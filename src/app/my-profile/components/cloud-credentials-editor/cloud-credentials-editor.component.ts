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

import { Observable } from 'rxjs';
import { map, mergeMap, startWith, distinctUntilChanged, shareReplay } from 'rxjs/operators';

// models
import { Cloud } from '../../../shared/models/cloud';
import { Credentials, AWSCredentials, OpenStackCredentials, AzureCredentials, GCPCredentials } from '../../../shared/models/profile';

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
    selector: 'clui-cloud-credentials-editor',
    templateUrl: './cloud-credentials-editor.component.html',
    providers: [CREDENTIALS_CONTROL_ACCESSOR, CREDENTIALS_CONTROL_VALIDATOR]
})
export class CloudCredentialsEditorComponent implements OnInit, ControlValueAccessor, Validator {
    allowCloudChange = true;
    errorMessage: string;
    errorDetails: string;
    _saveIsOptional = false;
    saveIsPressed = false;
    useCredsIsPressed = false;
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
    gcpCredsCtrl: FormControl = new FormControl(null, Validators.required);

    // Observables
    filteredCloudTypes: Observable<Cloud[]>;

    @Output()
    credentialsChanged = new EventEmitter<Credentials>();

    @Input()
    set credentials(creds: Credentials) {
        if (creds) {
            this.cloudCtrl.patchValue(creds.cloud);
            this.credentialsForm.patchValue(creds);
            if (this.getActiveProviderEditor()) {
                this.getActiveProviderEditor().patchValue(creds);
            }
        } else {
            this.cancelUseCredentials(null, null, true);
        }
    }
    get credentials(): Credentials {
        return this.formDataToCredentials(this.credentialsForm.value);
    }

    formDataToCredentials(data: any): Credentials {
        const creds = new Credentials();
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

    getActiveProviderEditor(): FormControl {
        return (<FormControl>this.credentialsForm.controls['provider_editor']);
    }

    @Input()
    set saveIsOptional(isOptional: boolean) {
        this._saveIsOptional = isOptional;
        this.nameCtrl.disable();
        this.credentialTermsCtrl.disable();
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
        this.cloudCtrl.valueChanges.pipe(distinctUntilChanged()).subscribe(cloud => this.onCloudChanged(cloud));
        this.cloudTypeCtrl.valueChanges.subscribe(cloudType => this.onCloudTypeChanged(cloudType));
    }

    ngOnInit() {
        // shareReplay so that the cloud call is made only once
        const cloudObservable = this._cloudService.getClouds().pipe(shareReplay(1));
        // this.cloudTypeCtrl.value has a value only after initial properties are set, so initialize
        // here on ngOnInit() instead of in constructor
        this.filteredCloudTypes = this.cloudTypeCtrl.valueChanges.pipe(
                                     startWith(this.cloudTypeCtrl.value),
                                     mergeMap(cloudType => cloudObservable.pipe(map(c => this.getCloudsForType(cloudType, c))))
                                  );
    }

    isSameCloud(c1: Cloud, c2: Cloud): boolean {
        return c1 && c2 && c1.id === c2.id;
    }

    onCloudChanged(cloud: Cloud) {
        if (cloud) {
            this.cloudType = cloud.resourcetype;
        }
        this.saveIsPressed = false;
        this.useCredsIsPressed = false;
    }

    getCloudsForType(cloudType: any, cloudList: Cloud[]) {
        if (cloudType) {
            return cloudList.filter(c => c.resourcetype === cloudType);
        } else {
            return cloudList;
        }
    }

    getEditorFor(cloudType: string) {
        if (cloudType === 'AWSCloud') {
            return this.awsCredsCtrl;
        } else if (cloudType === 'AzureCloud') {
            return this.azureCredsCtrl;
        } else if (cloudType === 'OpenStackCloud') {
            return this.openstackCredsCtrl;
        } else if (cloudType === 'GCPCloud') {
            return this.gcpCredsCtrl;
        } else {
            return null;
        }
    }

    onCloudTypeChanged(cloudType: string) {
        this.credentialsForm.setControl('provider_editor', this.getEditorFor(cloudType));
    }

    handleCredentialsFinalised(creds: Credentials) {
        this.credentials = creds;
        this.propagateChange(creds);
        this.credentialsChanged.emit(creds);
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
        this.errorDetails = null;
        this.credVerificationInProgress = true;
        creds.resourcetype = this.mapCloudTypeToCredentialsType(this.cloud.resourcetype);
        this._profileService.verifyCredentials(creds)
                    .subscribe(result => { this.handleVerificationResult(creds, result, successCallBack, failureCallBack); },
                               error => { this.handleVerificationFailure(creds, error, '', failureCallBack); });
    }

    handleVerificationResult(creds: Credentials, result: any, successCallback: VerificationSuccessCallback,
            failureCallback: VerificationFailureCallback) {
        this.credVerificationInProgress = false;
        if (result.result === 'SUCCESS') {
            successCallback(creds);
        } else {
            const message = 'The credentials you have entered could not be validated.';
            const dets = 'ERROR Details: ' + result.details;
            this.handleVerificationFailure(creds, message, dets, failureCallback);
        }
    }

    handleVerificationFailure(creds: Credentials, error: any, details: any, failureCallback: VerificationFailureCallback) {
        this.credVerificationInProgress = false;
        this.errorMessage = error;
        this.errorDetails = details;
        failureCallback(creds, error);
    }

    continueUseCredentials(creds: Credentials) {
        this.useCredsIsPressed = true;
        this.credentialsForm.disable();
        this.nameCtrl.disable();
        this.credentialTermsCtrl.disable();
        this.handleCredentialsFinalised(creds);
    }

    cancelUseCredentials(creds: Credentials, error: string, suppressEvent?: boolean) {
        this.useCredsIsPressed = false;
        this.credentialsForm.enable();
        if (this.saveIsOptional) {
            this.nameCtrl.disable();
            this.credentialTermsCtrl.disable();
        } else {
            this.nameCtrl.enable();
            this.credentialTermsCtrl.enable();
        }
        if (!suppressEvent) {
            this.handleCredentialsFinalised(null);
        }
    }

    setSaveIsPressed() {
        this.nameCtrl.enable();
        this.credentialTermsCtrl.enable();
        this.saveIsPressed = true;
    }

    cancelEdit() {
        // Clear form values
        if (this.saveIsOptional) {
            this.saveIsPressed = false;
            this.nameCtrl.disable();
            this.credentialTermsCtrl.disable();
        } else {
            this.credentialsForm.reset();
            this.handleCredentialsFinalised(null);
        }
    }

    validateCredentialsTerms(control: FormControl) {
        if (!control.value) {
            return {'terms_not_accepted': true};
        }
    }

    loadCredentialsFromFile($event: Event) {
        const file = (<HTMLInputElement>$event.target).files[0];
        if (file) {
            const credType = this.mapCloudTypeToCredentialsType(this.cloudCtrl.value.resourcetype);
            const parser = new CredentialParser(credType);
            parser.loadCredentialsFromFile(
                    (<HTMLInputElement>$event.target).files[0],
                    (creds) => this.handleLoadedCredentials(creds));
        }
    }

    handleLoadedCredentials(creds: Credentials) {
        if (creds.resourcetype === 'AWSCredentials') {
            this.awsCredsCtrl.patchValue(creds);
        } else if (creds.resourcetype === 'AzureCredentials') {
            this.azureCredsCtrl.patchValue(creds);
        } else if (creds.resourcetype === 'OpenStackCredentials') {
            this.openstackCredsCtrl.patchValue(creds);
        } else if (creds.resourcetype === 'GCPCredentials') {
            this.gcpCredsCtrl.patchValue(creds);
        }
    }

    saveEdit() {
        const creds = <Credentials>this.credentials;
        creds.cloud_id = creds.cloud.id;
        creds.default = creds.default || false;

        this.verifyCredentials(
                creds,
                (vcreds) => { this.continueSaveCredentials(vcreds); },
                (vcreds, error) => { this.endSaveCredentials(vcreds, error); });
    }

    mapCloudTypeToCredentialsType(cloudType: string): string {
        if (cloudType === 'AWSCloud') {
            return 'AWSCredentials';
        } else if (cloudType === 'AzureCloud') {
            return 'AzureCredentials';
        } else if (cloudType === 'OpenStackCloud') {
            return 'OpenStackCredentials';
        } else if (cloudType === 'GCPCloud') {
            return 'GCPCredentials';
        } else {
            return null;
        }
    }

    continueSaveCredentials(creds: Credentials) {
        if (creds.id) { // Has an id, therefore, it's an existing record
            creds.resourcetype = this.mapCloudTypeToCredentialsType(this.cloudTypeCtrl.value);
            this._profileService.saveCredentials(<Credentials>creds)
                .subscribe(result => this.handleCredentialsFinalised(result));
        } else { // Must be a new record
            creds.resourcetype = this.mapCloudTypeToCredentialsType(this.cloudTypeCtrl.value);
            this._profileService.createCredentials(<Credentials>creds)
                        .subscribe(result => this.handleCredentialsFinalised(result));
        }
        this.endSaveCredentials(creds, null);
    }

    endSaveCredentials(creds: Credentials, error: string) {
        if (this.saveIsOptional) {
            this.saveIsPressed = false;
            this.nameCtrl.disable();
            this.credentialTermsCtrl.disable();
        }
    }
}
