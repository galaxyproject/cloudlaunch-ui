import { Component, forwardRef } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    NG_VALUE_ACCESSOR,
    ControlValueAccessor,
    NG_VALIDATORS,
    Validator,
    ValidatorFn,
    AbstractControl
} from '@angular/forms';


const GCP_CREDENTIALS_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GCPCredEditorComponent),
    multi: true
};

const GCP_CREDENTIALS_CONTROL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => GCPCredEditorComponent),
    multi: true
};

@Component({
    selector: 'clui-gcp-cred-editor',
    templateUrl: './gcp-cred-editor.component.html',
    providers: [GCP_CREDENTIALS_CONTROL_ACCESSOR, GCP_CREDENTIALS_CONTROL_VALIDATOR]
})
export class GCPCredEditorComponent implements ControlValueAccessor, Validator {
    gcpCredentialsForm: FormGroup;

    // Form Controls
    credentials: FormControl = new FormControl(null, [Validators.required, this.jsonValidator()]);
    vmDefaultUserCtrl: FormControl = new FormControl('ubuntu', Validators.required);

    // Begin: implementation of ControlValueAccessor

    // the method set in registerOnChange, it is just
    // a placeholder for a method that takes one parameter,
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj) {
            this.gcpCredentialsForm.patchValue(obj);
        } else {
            this.gcpCredentialsForm.reset({'vm_default_username': 'ubuntu'});
        }
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.gcpCredentialsForm.disable();
        } else {
            this.gcpCredentialsForm.enable();
        }
    }
    // End: implementation of ControlValueAccessor

    // Begin: implementation of Validator interface
    public validate(c: FormControl) {
        // Delegate to form
        if (this.gcpCredentialsForm.disabled || this.gcpCredentialsForm.valid) {
            return null;
        } else {
            return { 'gcp_credentials': 'invalid' };
        }
    }
    // End: implementation of Validator interface

    constructor(fb: FormBuilder) {
        this.gcpCredentialsForm = fb.group({
            'credentials': this.credentials,
            'vm_default_username': this.vmDefaultUserCtrl,
        });
        this.gcpCredentialsForm.valueChanges.subscribe(data => this.propagateChange(data));
    }

    private jsonValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            try {
                JSON.parse(control.value);
                return null;
            } catch (e) {
                return {'json': {value: control.value}};
            }
        };
    }

}
