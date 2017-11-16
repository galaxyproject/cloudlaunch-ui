import { Component, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormGroupDirective,
    Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/switchMap';

import {
    Cloud,
    InstanceType,
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
    selector: 'cloudlaunch-config-control',
    templateUrl: './cloudlaunch-config-control.component.html',
    providers: [CloudService]
})

export class CloudLaunchConfigControlComponent extends BasePluginComponent {

    errorMessage: string;
    showAdvanced: boolean = false;

    CLOUD_SELECTION_HELP: string = 'Select a target cloud first';
    instanceTypeHelp: string = this.CLOUD_SELECTION_HELP;
    placementHelp: string = this.CLOUD_SELECTION_HELP;
    keypairsHelp: string = this.CLOUD_SELECTION_HELP;
    networksHelp: string = this.CLOUD_SELECTION_HELP;
    subnetsHelp: string = this.CLOUD_SELECTION_HELP;
    staticIPHelp: string = this.CLOUD_SELECTION_HELP;

    // Form Controls
    cloudLaunchForm: FormGroup;
    rootStorageTypeCtrl = new FormControl('instance', Validators.required);
    rootStorageSizeCtrl = new FormControl('');
    instTypeCtrl = new FormControl('', Validators.required);
    placementCtrl = new FormControl('');
    keypairCtrl = new FormControl('');
    networkCtrl = new FormControl('');
    subnetCtrl = new FormControl('');
    staticIpCtrl = new FormControl('');

    // Observables
    placementObservable: Observable<PlacementZone[]>;
    instanceTypeObservable: Observable<InstanceType[]>;
    keypairObservable: Observable<KeyPair[]>;
    networkObservable: Observable<Network[]>;
    staticIpObservable: Observable<StaticIP[]>;
    subnetObservable: Observable<SubNet[]>;

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
            'instanceType': this.instTypeCtrl,
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
        let cloudObservable = this.cloudCtrl.valueChanges.do(cloud => { this.onCloudChange(cloud); }).filter(c => !!c).shareReplay(1);
        // Properties dependent on cloud
        this.placementObservable = cloudObservable
                                      .do(cloud => { this.placementHelp = 'Retrieving placement options...'; })
                                      .switchMap(cloud => this._cloudService.getPlacementZones(cloud.slug, cloud.region_name))
                                      .do(placement => { this.placementHelp = 'In which placement zone would you like to launch this appliance?'; },
                                          error => { this.errorMessage = <any>error; });
        this.instanceTypeObservable = cloudObservable
                                         .do(cloud => { this.instanceTypeHelp = 'Retrieving instance types...'; })
                                         .switchMap(cloud => this._cloudService.getInstanceTypes(cloud.slug))
                                         .do(vmType => { this.instanceTypeHelp = 'What type of virtual hardware would you like to use?'; },
                                             error => { this.errorMessage = <any>error; });
        this.keypairObservable = cloudObservable
                                    .do(cloud => { this.keypairsHelp = 'Retrieving keypairs...'; })
                                    .switchMap(cloud => this._cloudService.getKeyPairs(cloud.slug))
                                    .do(kp => { this.keypairsHelp = 'Which keypair would you like to use for this Virtual Machine?'; },
                                        error => { this.errorMessage = <any>error; });
        this.networkObservable = cloudObservable
                                    .do(cloud => { this.networksHelp = 'Retrieving list of networks...';
                                                   this.subnetsHelp = 'Select a network first';})
                                    .switchMap(cloud => this._cloudService.getNetworks(cloud.slug))
                                    .do(net => { this.networksHelp = 'In which network would you like to place this Virtual Machine?'; },
                                        error => { this.errorMessage = <any>error; });
        this.staticIpObservable = cloudObservable
                                     .do(cloud => { this.staticIPHelp = 'Retrieving static IPs ...'; })
                                     .switchMap(cloud => this._cloudService.getStaticIPs(cloud.slug))
                                     .do(fip => { this.staticIPHelp = 'What static/floating IP would you like to assign to this Virtual Machine?'; },
                                         error => { this.errorMessage = <any>error; });
        // properties dependent on network
        let networkObservable = this.networkCtrl.valueChanges
                                    .do(network => { this.subnetsHelp = 'Retrieving list of subnets...'; this.subnetCtrl.patchValue(null) })
                                    .shareReplay(1);
        this.subnetObservable = Observable.combineLatest(cloudObservable, networkObservable)
                                   .switchMap(([cloud, net_id]) => this._cloudService.getSubNets(cloud.slug, net_id))
                                   .do(subnet => { this.subnetsHelp = 'In which subnet would you like to place this Virtual Machine?'; },
                                       error => { this.errorMessage = <any>error; });
        // properties dependent on storage type
        let storageObservable = this.rootStorageTypeCtrl.valueChanges.subscribe(storageType => { this.onRootStorageTypeChange(storageType); });
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }

    onCloudChange(cloud: Cloud) {
        // Reset all form values
        this.cloudLaunchForm.reset({rootStorageType: 'instance'});
        this.errorMessage = null;
        // Reapply initial config on cloud change
        this.initialConfig = this.initialConfig;
    }

    onRootStorageTypeChange(storageType: string) {
        if (storageType == 'instance') {
            this.rootStorageSizeCtrl.disable();
            this.rootStorageSizeCtrl.setValidators([]);
        }
        else {
            this.rootStorageSizeCtrl.enable();
            this.rootStorageSizeCtrl.setValidators([Validators.required]);
        }
    }

}
