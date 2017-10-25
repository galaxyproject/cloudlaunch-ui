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


const AZURE_CREDENTIALS_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AzureCredEditorComponent),
    multi: true
};

const AZURE_CREDENTIALS_CONTROL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => AzureCredEditorComponent),
    multi: true
};

@Component({
    selector: 'azure-cred-editor',
    templateUrl: './azure-cred-editor.component.html',
    providers: [AZURE_CREDENTIALS_CONTROL_ACCESSOR, AZURE_CREDENTIALS_CONTROL_VALIDATOR]
})
export class AzureCredEditorComponent implements ControlValueAccessor, Validator {
    azureCredentialsForm: FormGroup;

    // Form Controls
    subscriptionIdCtrl: FormControl = new FormControl(null, Validators.required);
    clientIdCtrl: FormControl = new FormControl(null, Validators.required);
    secretCtrl: FormControl = new FormControl(null, Validators.required);
    tenantCtrl: FormControl = new FormControl(null, Validators.required);


    // Begin: implementation of ControlValueAccessor

    // the method set in registerOnChange, it is just
    // a placeholder for a method that takes one parameter,
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj) {
            this.azureCredentialsForm.patchValue(obj);
        } else {
            this.azureCredentialsForm.reset();
        }
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.azureCredentialsForm.disable();
        } else {
            this.azureCredentialsForm.enable();
        }
    }
    // End: implementation of ControlValueAccessor

    // Begin: implementation of Validator interface
    public validate(c: FormControl) {
        // Delegate to form
        if (this.azureCredentialsForm.disabled || this.azureCredentialsForm.valid) {
            return null;
        } else {
            return { 'azure_credentials': 'invalid' };
        }
    }
    // End: implementation of Validator interface

    constructor(fb: FormBuilder) {
        this.azureCredentialsForm = fb.group({
            'subscription_id': this.subscriptionIdCtrl,
            'client_id': this.clientIdCtrl,
            'secret': this.secretCtrl,
            'tenant': this.tenantCtrl
        });
        this.azureCredentialsForm.valueChanges.subscribe(data => this.propagateChange(data));
    }
}
