import { OnInit, OnDestroy, Input, Host } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    FormGroupDirective
} from '@angular/forms';

// Provides automatic initialisation of form values based on an initial Config
// dictionary. Inheriting classes must implement the methods configName
// and initialConfig. This class will walk through the initialConfig object,
// setting form values as appropriate.
export abstract class BasePluginComponent implements OnInit, OnDestroy {
    protected targetCtrl = new FormControl('');
    private _initialConfig: any;

    get form(): FormGroup {
        throw new TypeError('get form must be implemented');
    }

    get configName(): string {
        throw new TypeError('get configName must be implemented');
    }

    @Input()
    public get initialConfig() {
        return this._initialConfig;
    }

    public set initialConfig(value) {
        this._initialConfig = value;
        if (value && value[this.configName]) {
            // Recursively set initial values on controls
            this.form.patchValue(value[this.configName]);
        }
    }

    @Input()
    public set target(value) {
        this.targetCtrl.patchValue(value);
    }

    public get target() {
        return this.targetCtrl.value;
    }

    constructor(fb: FormBuilder, private parentContainer: FormGroupDirective) {
    }

    ngOnInit() {
        // Add child form to parent so that validations roll up
        if (this.parentContainer != null) {
            this.parentContainer.form.addControl(this.configName, this.form);
        }
    }

    ngOnDestroy() {
        if (this.parentContainer != null) {
            this.parentContainer.form.removeControl(this.configName);
        }
    }
}
