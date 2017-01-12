import { Component, Host, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    FormGroupDirective } from '@angular/forms';
import { BasePluginComponent } from '../base-plugin.component';

@Component({
    selector: 'gvl-config',
    templateUrl: './gvl.component.html',
    inputs: ['initialConfig']
})
export class GVLConfigComponent extends BasePluginComponent {
    gvlLaunchForm: FormGroup;
    showAdvanced: boolean = false;
    gvlPasswordControl: FormControl = new FormControl(null, Validators.required);

    get form(): FormGroup {
        return this.gvlLaunchForm;
    }

    get configName(): string {
        return "config_gvl";
    }

    constructor(fb: FormBuilder, parentContainer: FormGroupDirective) {
        super(fb, parentContainer);
        this.gvlLaunchForm = fb.group({
            'gvl_cmdline_utilities': [''],
            'smrt_portal': ['']
        });
    }
    
    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }
}
