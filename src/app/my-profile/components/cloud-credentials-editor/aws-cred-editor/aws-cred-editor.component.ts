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


const AWS_CREDENTIALS_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AWSCredEditorComponent),
    multi: true
};

const AWS_CREDENTIALS_CONTROL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => AWSCredEditorComponent),
    multi: true
};

@Component({
    selector: 'aws-cred-editor',
    templateUrl: './aws-cred-editor.component.html',
    providers: [AWS_CREDENTIALS_CONTROL_ACCESSOR, AWS_CREDENTIALS_CONTROL_VALIDATOR]
})
export class AWSCredEditorComponent implements ControlValueAccessor, Validator {
    awsCredentialsForm: FormGroup;

    // Form Controls
    access_key: FormControl = new FormControl(null, Validators.required);
    secret_key: FormControl = new FormControl(null, Validators.required);


    // Begin: implementation of ControlValueAccessor

    // the method set in registerOnChange, it is just
    // a placeholder for a method that takes one parameter,
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj) {
            this.awsCredentialsForm.patchValue(obj);
        } else {
            this.awsCredentialsForm.reset();
        }
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.awsCredentialsForm.disable();
        } else {
            this.awsCredentialsForm.enable();
        }
    }
    // End: implementation of ControlValueAccessor

    // Begin: implementation of Validator interface
    public validate(c: FormControl) {
        // Delegate to form
        if (this.awsCredentialsForm.disabled || this.awsCredentialsForm.valid) {
            return null;
        } else {
            return { 'aws_credentials': 'invalid' };
        }
    }
    // End: implementation of Validator interface

    constructor(fb: FormBuilder) {
        this.awsCredentialsForm = fb.group({
            'access_key': this.access_key,
            'secret_key': this.secret_key
        });
        this.awsCredentialsForm.valueChanges.subscribe(data => this.propagateChange(data));
        console.log(this.awsCredentialsForm);
        console.log(this.access_key);
    }
}
