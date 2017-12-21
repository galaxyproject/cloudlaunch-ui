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
    Gateway,
    StaticIP
} from '../../../shared/models/cloud';

import { BasePluginComponent } from '../../plugins/base-plugin.component';

// models
import { Credentials } from '../../../shared/models/profile';

// Services
import { CloudService } from '../../../shared/services/cloud.service';
import { validateConfig } from '@angular/router/src/config';


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
    gatewayHelp = this.CLOUD_SELECTION_HELP;
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
    gatewayCtrl = new FormControl('');
    staticIpCtrl = new FormControl('');

    // Observables
    placementObs: Observable<PlacementZone[]>;
    vmTypeObs: Observable<VmType[]>;
    keypairObs: Observable<KeyPair[]>;
    networkObs: Observable<Network[]>;
    gatewayObs: Observable<Gateway[]>;
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
            'gateway': this.gatewayCtrl,
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
                                                 this.subnetsHelp = 'Before choosing a subnet, select a network first.';
                                                 this.gatewayHelp = 'Before choosing a gateway, select a network first.';
                                                 this.staticIPHelp = 'Before selecting a floating IP, select a network and a gateway.'; })
                                  .switchMap(cloud => this._cloudService.getNetworks(cloud.slug))
                                  .do(net => { this.networksHelp = 'In which network would you like to place this Virtual Machine?'; },
                                      error => { this.errorMessage = <any>error; });
        // Properties dependent on network
        const networkObs = this.networkCtrl.valueChanges
            .do(network => {this.subnetsHelp = 'Retrieving list of subnets...';
                            this.gatewayHelp = 'Retrieving internet gateways...';
                            this.subnetCtrl.patchValue(null); })
            .shareReplay(1);
        this.subnetObs = Observable.combineLatest(cloudObs, networkObs)
                                   .switchMap(([cloud, net_id]) => this._cloudService.getSubNets(cloud.slug, net_id))
                                   .do(subnet => { this.subnetsHelp = 'In which subnet would you like to place this Virtual Machine?'; },
                                       error => { this.errorMessage = <any>error; });
        this.gatewayObs = Observable.combineLatest(cloudObs, networkObs)
            .switchMap(([cloud, net_id]) => this._cloudService.getGateways(cloud.slug, net_id))
            .do(gateway => { this.gatewayHelp = 'Which internet gateway would you like to use for internet connectivity?';
                             this.staticIPHelp = 'Select internet gateway first.'; },
            error => { this.errorMessage = <any>error; });

        // Properties dependent on gateways
        const gatewayObs = this.gatewayCtrl.valueChanges
            .do(gateway => {this.staticIPHelp = 'Retrieving static IPs...'; })
            .shareReplay(1);
        this.staticIpObs = Observable.combineLatest(cloudObs, networkObs, gatewayObs)
                                     .switchMap(([cloud, net_id, gateway_id]) => this._cloudService.getStaticIPs(
                                         cloud.slug, net_id, gateway_id))
                                     .do(staticIP => { this.staticIPHelp = 'Which static IP would you like to attach to your appliance?'; },
                                        error => { this.errorMessage = <any>error; });

        // Properties dependent on storage type
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
