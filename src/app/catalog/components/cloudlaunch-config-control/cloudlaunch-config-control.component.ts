import { Component, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormGroupDirective,
    Validators
} from '@angular/forms';

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
    instanceTypes: InstanceType[] = [];
    instanceTypeHelp: string = this.CLOUD_SELECTION_HELP;
    regions: Region[] = [];
    regionHelp: string = this.CLOUD_SELECTION_HELP;
    placements: PlacementZone[] = [];
    placementHelp: string = this.CLOUD_SELECTION_HELP;
    keypairs: KeyPair[] = [];
    keypairsHelp: string = this.CLOUD_SELECTION_HELP;
    networks: Network[] = [];
    networksHelp: string = this.CLOUD_SELECTION_HELP;
    subnets: SubNet[] = [];
    subnetsHelp: string = this.CLOUD_SELECTION_HELP;
    staticIPs: StaticIP[] = [];
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
        this.cloudCtrl.valueChanges.subscribe(cloud => { this.onCloudChange(cloud); });
        this.networkCtrl.valueChanges.subscribe(network => { this.onNetworkChange(network); });
        this.rootStorageTypeCtrl.valueChanges.subscribe(storageType => { this.onRootStorageTypeChange(storageType); });
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }

    onCloudChange(cloud: Cloud) {
        // Reset all form values
        this.cloudLaunchForm.reset({rootStorageType: 'instance'});
        if (cloud) {
            // Fetch options for the newly selected cloud
            this.getPlacements(cloud);
            this.getInstanceTypes(cloud);
            this.getKeyPairs(cloud);
            this.getNetworks(cloud);
            this.getStaticIPs(cloud);
        }
        // Reapply initial config on cloud change
        this.initialConfig = this.initialConfig;
    }

    getInstanceTypes(cloud: Cloud) {
        this.instanceTypeHelp = 'Retrieving instance types...';
        this.instanceTypes = [];
        this._cloudService.getInstanceTypes(cloud.slug)
            .subscribe(
                    instanceTypes => this.instanceTypes = instanceTypes,
                    error => this.errorMessage = <any>error,
                    () => { this.instanceTypeHelp = 'What type of virtual hardware would you like to use?'; });
    }

    getPlacements(cloud: Cloud) {
        this.placementHelp = 'Retrieving placement options...';
        this.placements = [];
        this._cloudService.getPlacementZones(cloud.slug, cloud.region_name)
            .subscribe(
                    placements => this.placements = placements,
                    error => this.errorMessage = <any>error,
                    () => { this.placementHelp = 'In which placement zone would you like to launch this appliance?'; });
    }

    getKeyPairs(cloud: Cloud) {
        this.keypairsHelp = 'Retrieving keypairs...';
        this.keypairs = [];
        this._cloudService.getKeyPairs(cloud.slug)
            .subscribe(
                    keypairs => this.keypairs = keypairs,
                    error => this.errorMessage = <any>error,
                    () => { this.keypairsHelp = 'Which keypair would you like to use for this Virtual Machine?'; });
    }

    getNetworks(cloud: Cloud) {
        this.networksHelp = 'Retrieving list of networks...';
        this.subnetsHelp = 'Select a network first';
        this.networks = [];
        this._cloudService.getNetworks(cloud.slug)
            .subscribe(
                    networks => this.networks = networks,
                    error => this.errorMessage = <any>error,
                    () => { this.networksHelp = 'In which network would you like to place this Virtual Machine?'; });
    }

    onNetworkChange(network: Network) {
        this.subnetCtrl.patchValue(null);
        if (this.cloud && network)
            this.getSubnets(this.cloud, network.id);
    }

    getSubnets(cloud: Cloud, networkId: string) {
        this.subnetsHelp = 'Retrieving list of subnets...';
        this.subnets = [];
        this._cloudService.getSubNets(cloud.slug, networkId)
            .subscribe(
                    subnets => this.subnets = subnets,
                    error => this.errorMessage = <any>error,
                    () => { this.subnetsHelp = 'In which subnet would you like to place this Virtual Machine?'; });
    }

    getStaticIPs(cloud: Cloud) {
        this.staticIPHelp = 'Retrieving static IPs ...';
        this.staticIPs = [];
        this._cloudService.getStaticIPs(cloud.slug)
            .subscribe(
                    ips => this.staticIPs = ips,
                    error => this.errorMessage = <any>error,
                    () => { this.staticIPHelp = 'What static/floating IP would you like to assign to this Virtual Machine?'; });
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
