import { Component, forwardRef, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    NG_VALUE_ACCESSOR,
    ControlValueAccessor,
    NG_VALIDATORS,
    Validator, FormGroupDirective
} from '@angular/forms';

// models
import {DnsZone, VmType} from '../../../shared/models/cloud';

// Services
import { CloudService } from '../../../shared/services/cloud.service';
import {merge, Observable} from "rxjs";
import {filter, map, shareReplay, switchMap, tap, startWith} from "rxjs/operators";
import {Credentials} from "../../../shared/models/profile";


const HOSTNAME_SELECT_CONTROL_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => HostnameSelectorComponent),
    multi: true
};

const HOSTNAME_SELECT_CONTROL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => HostnameSelectorComponent),
    multi: true
};

@Component({
    selector: 'clui-hostname-selector',
    templateUrl: './hostname-selector.component.html',
    providers: [HOSTNAME_SELECT_CONTROL_ACCESSOR, HOSTNAME_SELECT_CONTROL_VALIDATOR]
})
export class HostnameSelectorComponent implements ControlValueAccessor, Validator {

    DNS_ZONE_SELECTION_HELP = 'Select a host zone';
    dnsZoneHelp = this.DNS_ZONE_SELECTION_HELP;

    // Form Controls
    hostnameForm: FormGroup;
    targetCtrl = new FormControl('');
    credentialsCtrl = new FormControl('');
    hostnameTypeCtrl = new FormControl('none', Validators.required);
    // Only if hostnameType == 'manual'
    manualHostnameCtrl = new FormControl(null, Validators.required);
    // Only if hostnameType == 'cloud_dns'
    dnsZoneCtrl = new FormControl(null, Validators.required);
    dnsRecordCtrl = new FormControl(null);

    // Observables
    dnsZoneObs: Observable<DnsZone[]>;

    @Input()
    public set credentials(creds: Credentials) {
        // Force refresh on credential change
        this.credentialsCtrl.patchValue(creds);
    }

    public get credentials() {
        return this.credentialsCtrl.value;
    }

    @Input()
    public set target(value) {
        this.targetCtrl.patchValue(value);
    }

    public get target() {
        return this.targetCtrl.value;
    }

    // Begin: implementation of ControlValueAccessor

    // the method set in registerOnChange, it is just
    // a placeholder for a method that takes one parameter,
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };

    // this is the initial value set to the component
    public writeValue(obj: any) {
        // Ignore, we only emit values based on the current
        // selection
        if (obj) {
            this.hostnameForm.patchValue(obj);
        } else {
            this.hostnameForm.reset({'hostnameType': 'none'});
        }
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.hostnameForm.disable();
        } else {
            this.hostnameForm.enable();
        }
    }
    // End: implementation of ControlValueAccessor

    // Begin: implementation of Validator interface
    public validate(c: FormControl) {
        // Delegate to form
        if (this.hostnameForm.disabled || this.hostnameForm.valid) {
            return null;
        } else {
            return { 'hostname_config': 'invalid' };
        }
    }
    // End: implementation of Validator interface


    constructor(fb: FormBuilder,
                private _cloudService: CloudService) {
        this.hostnameForm = fb.group({
            'hostnameType': this.hostnameTypeCtrl,
            // Only if hostnameType == 'cloud_dns'
            'dnsZone': this.dnsZoneCtrl,
            'dnsRecordName': this.dnsRecordCtrl,
            // Only if hostnameType == 'manual'
            'hostName': this.manualHostnameCtrl,
        });
        // Enable/disable initial controls
        this.handleHostNameTypeChange(this.hostnameTypeCtrl.value);
        this.hostnameForm.valueChanges.subscribe(data => this.propagateChangedValues(data));
        this.hostnameTypeCtrl.valueChanges.subscribe(data => this.handleHostNameTypeChange(data));

        // share replay ensures that subscribers who join at any time get the last emitted value immediately
        // Also trigger this observable whenever credentials change
        const targetObs = merge(
            this.targetCtrl.valueChanges,
            this.credentialsCtrl.valueChanges)
            .pipe(
                startWith(<string>null),
                map(val => this.targetCtrl.value),
                filter(t => !!t),
                shareReplay(1));
        this.dnsZoneObs = targetObs.pipe(
                                tap(target => { this.dnsZoneHelp = 'Retrieving dns zones...'; }),
                                switchMap(target =>
                                    this._cloudService.getDnsZones(target.target_zone.cloud.id, target.target_zone.region.region_id,
                                        target.target_zone.zone_id)),
                                tap(dnsZones => { this.dnsZoneHelp = 'Which Host Zone would you like to use?'; },
                                    error => { this.dnsZoneHelp = <any>error; }));
    }

    propagateChangedValues(hostname: string) {
        this.propagateChange(hostname);
    }

    handleHostNameTypeChange(hostnameType: string) {
        switch (hostnameType) {
            case 'cloud_dns': {
                this.manualHostnameCtrl.disable();
                this.dnsZoneCtrl.enable();
                this.dnsRecordCtrl.enable();
                break;
            }
            case 'manual': {
                this.manualHostnameCtrl.enable();
                this.dnsZoneCtrl.disable();
                this.dnsRecordCtrl.disable();
                break;
            }
            default: {
                this.manualHostnameCtrl.disable();
                this.dnsZoneCtrl.disable();
                this.dnsRecordCtrl.disable();
                break;
            }
        }
    }

}
