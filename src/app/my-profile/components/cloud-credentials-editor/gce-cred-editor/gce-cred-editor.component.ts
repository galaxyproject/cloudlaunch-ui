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


const GCE_CREDENTIALS_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GCECredEditorComponent),
    multi: true
};

const GCE_CREDENTIALS_CONTROL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => GCECredEditorComponent),
    multi: true
};

@Component({
    selector: 'gce-cred-editor',
    templateUrl: './gce-cred-editor.component.html',
    providers: [GCE_CREDENTIALS_CONTROL_ACCESSOR, GCE_CREDENTIALS_CONTROL_VALIDATOR]
})
export class GCECredEditorComponent implements ControlValueAccessor, Validator {
    gceCredentialsForm: FormGroup;

    // Form Controls
    credentials: FormControl = new FormControl(null, [Validators.required, this.jsonValidator()]);

    // Begin: implementation of ControlValueAccessor

    // the method set in registerOnChange, it is just
    // a placeholder for a method that takes one parameter,
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj) {
            this.gceCredentialsForm.patchValue(obj);
        } else {
            this.gceCredentialsForm.reset();
        }
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.gceCredentialsForm.disable();
        } else {
            this.gceCredentialsForm.enable();
        }
    }
    // End: implementation of ControlValueAccessor

    // Begin: implementation of Validator interface
    public validate(c: FormControl) {
        // Delegate to form
        if (this.gceCredentialsForm.disabled || this.gceCredentialsForm.valid) {
            return null;
        } else {
            return { 'gce_credentials': 'invalid' };
        }
    }
    // End: implementation of Validator interface

    constructor(fb: FormBuilder) {
        this.gceCredentialsForm = fb.group({
            'credentials': this.credentials,
        });
        this.gceCredentialsForm.valueChanges.subscribe(data => this.propagateChange(data));
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
