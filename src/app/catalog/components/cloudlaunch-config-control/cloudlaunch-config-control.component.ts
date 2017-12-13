import { Component, Input, OnDestroy } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormGroupDirective,
    Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

import {
    Cloud,
    VmType,
    Region,
    PlacementZone,
    KeyPair,
    Network,
    SubNet,
    StaticIP
} from '../../../shared/models/cloud';

import { BasePluginComponent } from '../../plugins/base-plugin.component';

// models
import { Credentials } from '../../../shared/models/profile';

// Services
import { CloudService } from '../../../shared/services/cloud.service';


@Component({
    selector: 'clui-cloud-config-control',
    templateUrl: './cloudlaunch-config-control.component.html',
    providers: [CloudService]
})

export class CloudLaunchConfigControlComponent extends BasePluginComponent implements OnDestroy {

    errorMessage: string;
    showAdvanced = false;

    CLOUD_SELECTION_HELP = 'Select a target cloud first';
    vmTypeHelp = this.CLOUD_SELECTION_HELP;
    placementHelp = this.CLOUD_SELECTION_HELP;
    keypairsHelp = this.CLOUD_SELECTION_HELP;
    networksHelp = this.CLOUD_SELECTION_HELP;
    subnetsHelp = this.CLOUD_SELECTION_HELP;
    staticIPHelp = this.CLOUD_SELECTION_HELP;

    // Form Controls
    cloudLaunchForm: FormGroup;
    DEFAULT_ROOT_STORAGE_TYPE = 'instance';
    rootStorageTypeCtrl = new FormControl(this.DEFAULT_ROOT_STORAGE_TYPE, Validators.required);
    rootStorageSizeCtrl = new FormControl('');
    vmTypeCtrl = new FormControl('', Validators.required);
    placementCtrl = new FormControl('');
    keypairCtrl = new FormControl('');
    networkCtrl = new FormControl('');
    subnetCtrl = new FormControl('');
    staticIpCtrl = new FormControl('');

    // Observables
    placementObs: Observable<PlacementZone[]>;
    vmTypeObs: Observable<VmType[]>;
    keypairObs: Observable<KeyPair[]>;
    networkObs: Observable<Network[]>;
    staticIpObs: Observable<StaticIP[]>;
    subnetObs: Observable<SubNet[]>;
    storageSubscription: Subscription;

    get form(): FormGroup {
        return this.cloudLaunchForm;
    }

    get configName(): string {
        return 'config_cloudlaunch';
    }

    constructor(fb: FormBuilder, parentContainer: FormGroupDirective,
        private _cloudService: CloudService) {
        super(fb, parentContainer);
        this.cloudLaunchForm = fb.group({
            'vmType': this.vmTypeCtrl,
            'rootStorageType': this.rootStorageTypeCtrl,
            'rootStorageSize': this.rootStorageSizeCtrl,
            'placementZone': this.placementCtrl,
            'keyPair': this.keypairCtrl,
            'network': this.networkCtrl,
            'subnet': this.subnetCtrl,
            'staticIP': this.staticIpCtrl,
            'customImageID': [null],
            'provider_settings': fb.group({
                'ebsOptimised': [''],
                'volumeIOPS': [''],
            })
        });
        // share replay ensures that subscribers who join at any time get the last emitted value immediately
        const cloudObs = this.cloudCtrl.valueChanges.do(cloud => { this.onCloudChange(cloud); }).filter(c => !!c).shareReplay(1);
        // Properties dependent on cloud
        this.placementObs = cloudObs.do(cloud => { this.placementHelp = 'Retrieving placement options...'; })
                                    .switchMap(cloud => this._cloudService.getPlacementZones(cloud.slug, cloud.region_name))
                                    .do(placement => { this.placementHelp = 'In which placement zone would you like to launch this'
                                                         + ' appliance?'; },
                                          error => { this.errorMessage = <any>error; });
        this.vmTypeObs = cloudObs.do(cloud => { this.vmTypeHelp = 'Retrieving instance types...'; })
                                       .switchMap(cloud => this._cloudService.getVmTypes(cloud.slug))
                                       .do(vmType => { this.vmTypeHelp = 'What type of virtual hardware would you like to use?'; },
                                           error => { this.errorMessage = <any>error; });
        this.keypairObs = cloudObs.do(cloud => { this.keypairsHelp = 'Retrieving keypairs...'; })
                                  .switchMap(cloud => this._cloudService.getKeyPairs(cloud.slug))
                                  .do(kp => { this.keypairsHelp = 'Which keypair would you like to use for this Virtual Machine?'; },
                                      error => { this.errorMessage = <any>error; });
        this.networkObs = cloudObs.do(cloud => { this.networksHelp = 'Retrieving list of networks...';
                                                 this.subnetsHelp = 'Select a network first'; })
                                  .switchMap(cloud => this._cloudService.getNetworks(cloud.slug))
                                  .do(net => { this.networksHelp = 'In which network would you like to place this Virtual Machine?'; },
                                      error => { this.errorMessage = <any>error; });
        this.staticIpObs = cloudObs.do(cloud => { this.staticIPHelp = 'Retrieving static IPs ...'; })
                                   .switchMap(cloud => this._cloudService.getStaticIPs(cloud.slug))
                                   .do(fip => { this.staticIPHelp = 'What static/floating IP would you like to assign to this Virtual'
                                                + ' Machine?'; },
                                       error => { this.errorMessage = <any>error; });
        // properties dependent on network
        const networkObs = this.networkCtrl.valueChanges
                                           .do(network => { this.subnetsHelp = 'Retrieving list of subnets...';
                                                            this.subnetCtrl.patchValue(null); })
                                           .shareReplay(1);
        this.subnetObs = Observable.combineLatest(cloudObs, networkObs)
                                   .switchMap(([cloud, net_id]) => this._cloudService.getSubNets(cloud.slug, net_id))
                                   .do(subnet => { this.subnetsHelp = 'In which subnet would you like to place this Virtual Machine?'; },
                                       error => { this.errorMessage = <any>error; });
        // properties dependent on storage type
        this.storageSubscription = this.rootStorageTypeCtrl.valueChanges.subscribe(
                                        storageType => { this.onRootStorageTypeChange(storageType); });
    }

    ngOnDestroy() {
        if (this.storageSubscription) {
            this.storageSubscription.unsubscribe();
        }
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }

    onCloudChange(cloud: Cloud) {
        // Reset all form values
        this.cloudLaunchForm.reset({rootStorageType: this.DEFAULT_ROOT_STORAGE_TYPE});
        this.errorMessage = null;
        // Reapply initial config on cloud change
        this.initialConfig = this.initialConfig;
    }

    onRootStorageTypeChange(storageType: string) {
        if (storageType === 'instance') {
            this.rootStorageSizeCtrl.disable();
            this.rootStorageSizeCtrl.setValidators([]);
        } else {
            this.rootStorageSizeCtrl.enable();
            this.rootStorageSizeCtrl.setValidators([Validators.required]);
        }
    }

}
