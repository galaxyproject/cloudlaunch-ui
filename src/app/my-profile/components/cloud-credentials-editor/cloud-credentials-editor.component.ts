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

declare type FileParserCallback = (string, CloudCredentialsEditorComponent) => void;

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
    _saveIsOptional: boolean = false;
    saveIsPressed: boolean = false;
    useCredsIsPressed: boolean = false;
    // Form Controls
    ctrl_id: FormControl = new FormControl(null);
    ctrl_name: FormControl = new FormControl(null, Validators.required);
    ctrl_default: FormControl = new FormControl(null);
    ctrl_cloud: FormControl = new FormControl(null, Validators.required);
    ctrl_aws_creds: FormControl = new FormControl(null, Validators.required);
    ctrl_openstack_creds: FormControl = new FormControl(null, Validators.required);
    ctrl_credential_terms: FormControl = new FormControl(null, this.validateCredentialsTerms);


    @Input()
    set credentials(creds: Credentials) {
        if (creds) {
            if (!this.cloud && creds.cloud) {
                this.onCloudSelect(creds.cloud);
            }
            this.ctrl_creds.patchValue(creds);
            this.credentialsForm.patchValue(creds);
            
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
        this.ctrl_credential_terms.disable()
    }
    get saveIsOptional() { return this._saveIsOptional; }
    
    @Output()
    onCredentialsChanged = new EventEmitter<Credentials>();
    
    get ctrl_creds() : FormControl {
        let cloud_type = "";
        if (this.cloud)
            cloud_type = this.cloud.cloud_type;
        if (cloud_type == "aws")
            return this.ctrl_aws_creds;
        else if (cloud_type == "openstack")
            return this.ctrl_openstack_creds;
        else
            return new FormControl(null, Validators.required);
    }
    

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
            'id': this.ctrl_id,
            'name': this.ctrl_name,
            'default': this.ctrl_default,
            'cloud': this.ctrl_cloud,
            'credentials': this.ctrl_creds,
            'credential_terms': this.ctrl_credential_terms
        });
    }

    ngOnInit() {
        this._cloudService.getClouds().subscribe(
            clouds => this.availableClouds = clouds.map(t => { return this.ng2SelectAdjust(t); }),
            error => this.errorMessage = <any>error);
        this.onCloudSelect(this.cloud);
    }


    onCloudSelect(cloud: any) {
        this.ng2SelectAdjust(cloud);
        if (this.availableClouds && cloud) {
            let matching_cloud = this.availableClouds.filter(c => c.slug === cloud.id);
            this.ctrl_cloud.setValue(matching_cloud[0]);
        } else {
            this.ctrl_cloud.setValue(cloud);
        }
        this.saveIsPressed = false;
        this.useCredsIsPressed = false;
        this.credentialsForm.setControl('credentials', this.ctrl_creds);
    }

    getSelectedCloud() {
        if (this.ctrl_cloud.value) {
            return [this.ctrl_cloud.value];
        }
        return null;
    }

    ng2SelectAdjust(cloud: Cloud) {
        // Satisfy ng2-select requirements
        if (cloud && cloud.slug) {
            cloud.id = cloud.slug;
            cloud.text = cloud.name;
        }
        return cloud;
    }

    handleCredentialsChanged(creds: Credentials) {
        this.propagateChange(creds);
        this.onCredentialsChanged.emit(creds);
    }

    useCredentials() {
        this.useCredsIsPressed = !this.useCredsIsPressed;
        if (this.useCredsIsPressed) {
            this.credentialsForm.disable();
            this.ctrl_name.disable();
            this.ctrl_credential_terms.disable()
            this.handleCredentialsChanged(this.credentials);
        }
        else {
            this.credentialsForm.enable();
            this.ctrl_name.disable();
            this.ctrl_credential_terms.disable()
            this.handleCredentialsChanged(null);
        }
    }
    
    setSaveIsPressed() {
        this.ctrl_name.enable();
        this.ctrl_credential_terms.enable()
        this.saveIsPressed = true;
    }

    cancelEdit() {
        // Clear form values
        if (this.saveIsOptional) {
            this.saveIsPressed = false;
            this.ctrl_name.disable();
            this.ctrl_credential_terms.disable()
        } else {
            this.credentialsForm.reset();
            this.handleCredentialsChanged(this.credentialsForm.value);
        }
    }
    
    validateCredentialsTerms(control: FormControl) {
        if (!control.value)
            return {"terms_note_accepted": true}
    }
        
    
    // BEGIN: Credential File Parsing Functions

    loadCredentialsFromFile($event: Event) {
        let parserFunc: FileParserCallback;
        if (this.cloud && this.cloud.cloud_type) {
            if (this.cloud.cloud_type == "openstack")
                parserFunc = this.parseOpenstackCreds;
            else if (this.cloud.cloud_type == "aws")
                parserFunc = this.parseAWSCreds;
        }        
        this.readCredentialsFile((<HTMLInputElement>$event.target).files[0], parserFunc);
    }
    
    readCredentialsFile(file: File, parserFunc: FileParserCallback) : void {
        var reader: FileReader = new FileReader();
        
        let self = this;

        reader.onloadend = function(e) { parserFunc(reader.result, self); }
        reader.onerror = function(e) { console.log(e); }
        reader.readAsText(file);
    }
    
    static extractValueByKey(key: string, content: string) : string {
        /* Regex description:
        Match the key, value part of a string like
        export OS_TENANT_NAME="<value>" or
        AWS_ACCESS_KEY: "<value>"
        
        With the result being <value>, without quotes.
        
        Begins by matching full text of keyname, followed by optional = or : symbols,
        followed by an optional whitespace, followed by an optional capture group (1)
        for the double quote, followed by any text other than doule-quotes. $ symbols
        and new lines, followed by capture group (1) again if it existed (this make
         sure that either both beginning and ending double-quotes are present, or
        none are). The value corresponding to the key will end up in match group 2.
        */
        let regex = new RegExp(key + '[=:]\\s?(")?([^"\\n\\$]+)\\1?');
        let match = regex.exec(content);
        if (match)
            return match[2];
        else
            return null;
    }
    
    parseOpenstackCreds(content: string, editor: CloudCredentialsEditorComponent) {
        let creds = {
            'project_name': CloudCredentialsEditorComponent.extractValueByKey("OS_PROJECT_NAME", content) ||
                CloudCredentialsEditorComponent.extractValueByKey("OS_TENANT_NAME", content),
            'username': CloudCredentialsEditorComponent.extractValueByKey("OS_USERNAME", content),
            'password': CloudCredentialsEditorComponent.extractValueByKey("OS_PASSWORD", content),
            'user_domain_name': CloudCredentialsEditorComponent.extractValueByKey("OS_USER_DOMAIN_NAME", content),
            'project_domain_name': CloudCredentialsEditorComponent.extractValueByKey("OS_PROJECT_DOMAIN_NAME", content)
        }
        editor.ctrl_openstack_creds.patchValue(creds);
    }
    
    parseAWSCreds(content: string, editor: CloudCredentialsEditorComponent) {
        let creds = {
            'access_key': CloudCredentialsEditorComponent.extractValueByKey("ACCESS_KEY", content),
            'secret_key': CloudCredentialsEditorComponent.extractValueByKey("SECRET_KEY", content)
        }
        editor.ctrl_aws_creds.patchValue(creds);
    }
    // END: Credential File Parsing Functions

    saveEdit() {
        let creds = <any>this.credentials;
        creds.cloud_id = creds.cloud.id;
        creds.default = creds.default || false;

        if (creds.id) { // Has an id, therefore, it's an existing record
            switch (this.cloud.cloud_type) {
                case 'aws':
                    this._profileService.saveCredentialsAWS(creds)
                        .subscribe(result => { this.handleCredentialsChanged(result); });
                    break;
                case 'openstack':
                    this._profileService.saveCredentialsOpenStack(creds)
                        .subscribe(result => { this.handleCredentialsChanged(result); });
                    break;
            }

        } else { // Must be a new record
            switch (this.cloud.cloud_type) {
                case 'aws':
                    this._profileService.createCredentialsAWS(creds)
                        .subscribe(result => { this.handleCredentialsChanged(result); });
                    break;
                case 'openstack':
                    this._profileService.createCredentialsOpenStack(creds)
                        .subscribe(result => { this.handleCredentialsChanged(result); });
                    break;
            }
        }
        if (this.saveIsOptional) {
            this.saveIsPressed = false;
            this.ctrl_name.disable();
            this.ctrl_credential_terms.disable()
        }
    }
}
