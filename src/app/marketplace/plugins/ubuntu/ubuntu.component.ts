import { Component, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroupDirective } from '@angular/forms';
import { BasePluginComponent } from '../base-plugin.component';


@Component({
    selector: 'ubuntu-config',
    template: ``,
    inputs: ['cloud', 'initialConfig']
})
export class UbuntuConfigComponent extends BasePluginComponent {

    constructor(fb: FormBuilder, parentContainer: FormGroupDirective) {
        super(fb, parentContainer);
    }

    get configName(): string {
        return "config_ubuntu";
    }
}
