import { Component, Host, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    FormGroupDirective
} from '@angular/forms';
import { BasePluginComponent } from '../base-plugin.component';
import { CloudService } from '../../../shared/services/cloud.service';

@Component({
    selector: 'clui-cm2-config',
    templateUrl: './cloudman2.component.html',
    providers: [CloudService],
    // tslint:disable-next-line:use-input-property-decorator
    inputs: ['cloud', 'initialConfig']
})
export class CloudMan2ConfigComponent extends BasePluginComponent {

    @Input()
    set password(value: string) { this.showPassword = false; this.cm2PasswordCtrl.setValue(value); }
    get password(): string { return this.cm2PasswordCtrl.value; }

    cm2LaunchForm: FormGroup;
    showPassword = false;
    cm2PasswordCtrl: FormControl = new FormControl(null, Validators.required);

    get form(): FormGroup {
        return this.cm2LaunchForm;
    }

    get configName(): string {
        return 'config_cloudman2';
    }

    constructor(fb: FormBuilder, parentContainer: FormGroupDirective) {
        super(fb, parentContainer);
        this.cm2LaunchForm = fb.group({
            'clusterPassword': this.cm2PasswordCtrl
        });
    }
}
