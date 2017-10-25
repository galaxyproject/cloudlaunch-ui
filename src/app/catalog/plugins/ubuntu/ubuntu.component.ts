import { Component, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective } from '@angular/forms';
import { BasePluginComponent } from '../base-plugin.component';


@Component({
    selector: 'ubuntu-config',
    template: ``
})
export class UbuntuConfigComponent extends BasePluginComponent {
    ubuntuLaunchForm: FormGroup;

    constructor(fb: FormBuilder, parentContainer: FormGroupDirective) {
        super(fb, parentContainer);
        this.ubuntuLaunchForm = fb.group({});
    }

    get form(): FormGroup {
        return this.ubuntuLaunchForm;
    }

    get configName(): string {
        return "config_ubuntu";
    }
}
