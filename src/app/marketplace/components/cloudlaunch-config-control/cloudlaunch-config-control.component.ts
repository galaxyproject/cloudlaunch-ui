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
    _cloud: Cloud;

    @Input()
    initialConfig: any;

    @Input()
    set cloud(value) {
        this._cloud = value;
        this.onCloudSelect(value);
    }

    get cloud() {
        return this._cloud;
    }

    CLOUD_SELECTION_HELP: string = 'Select a target cloud first';
    errorMessage: string;
    showAdvanced: boolean = false;
    cloudFields = true; // Used to reset form fields that are dependent on cloud selection
    // See 'reset' on https://angular.io/docs/ts/latest/guide/forms.html

    cloudLaunchForm: FormGroup;
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
            'instanceType': ['', Validators.required],
            'placementZone': [''],
            'keyPair': [''],
            'network': [''],
            'subnet': [''],
            'staticIP': [''],
            'provider_settings': fb.group({
                'ebsOptimised': [''],
                'volumeIOPS': [''],
            })
        });
    }

    onCloudSelect(cloud: Cloud) {
        this.cloudFields = false;
        setTimeout(() => this.cloudFields = true, 0);
        // Fetch options for the newly selected cloud
        this.getPlacements(cloud);
        this.getInstanceTypes(cloud);
        this.getKeyPairs(cloud);
        this.getNetworks(cloud);
        this.getStaticIPs(cloud);
    }

    getInstanceTypes(cloud: Cloud) {
        this.instanceTypeHelp = 'Retrieving instance types...';
        this.instanceTypes = [];
        this._cloudService.getInstanceTypes(cloud.slug)
            .subscribe(instanceTypes => this.instanceTypes = instanceTypes.map(t => { t.id = t.name; t.text = t.name; return t; }),
            error => this.errorMessage = <any>error,
            () => { this.instanceTypeHelp = 'Select an Instance Type'; });
    }

    onInstanceTypeSelect(instanceType: InstanceType) {
        (<FormControl>this.cloudLaunchForm.controls['instanceType']).setValue(instanceType.id);
    }

    getSelectedInstanceType() {
        if ((<FormControl>this.cloudLaunchForm.controls['instanceType']).value) {
            return [(<FormControl>this.cloudLaunchForm.controls['instanceType']).value];
        }
        return null;
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }

    getPlacements(cloud: Cloud) {
        this.placementHelp = 'Retrieving placement options...';
        this.placements = [];
        this._cloudService.getPlacementZones(cloud.slug, cloud.region_name)
            .subscribe(placements => this.placements = placements.map(p => { p.text = p.name; return p; }),
            error => this.errorMessage = <any>error,
            () => { this.placementHelp = 'Select a placement'; });
    }

    onPlacementSelect(placement: PlacementZone) {
        (<FormControl>this.cloudLaunchForm.controls['placementZone']).setValue(placement.id);
    }

    getKeyPairs(cloud: Cloud) {
        this.keypairsHelp = 'Retrieving keypairs...';
        this.keypairs = [];
        this._cloudService.getKeyPairs(cloud.slug)
            .subscribe(keypairs => this.keypairs = keypairs.map(kp => { kp.text = kp.name; return kp; }),
            error => this.errorMessage = <any>error,
            () => { this.keypairsHelp = 'Select a keypair'; });
    }

    onKeyPairSelect(kp: KeyPair) {
        (<FormControl>this.cloudLaunchForm.controls['keyPair']).setValue(kp.id);
    }

    getNetworks(cloud: Cloud) {
        this.networksHelp = 'Retrieving list of networks...';
        (<FormControl>this.cloudLaunchForm.controls['network']).setValue(null);
        this.subnetsHelp = 'Select a network first';
        this.networks = [];
        this._cloudService.getNetworks(cloud.slug)
            .subscribe(networks => this.networks = networks.map(n => { n.text = n.name ? n.name : n.id; return n; }),
            error => this.errorMessage = <any>error,
            () => { this.networksHelp = 'Select a network'; });
    }

    onNetworkSelect(network: Network) {
        (<FormControl>this.cloudLaunchForm.controls['network']).setValue(network.id);
        this.getSubnets(this.cloud, network.id);
    }

    getSubnets(cloud: Cloud, networkId: string) {
        this.subnetsHelp = 'Retrieving list of subnets...';
        this.subnets = [];
        this._cloudService.getSubNets(cloud.slug, networkId)
            .subscribe(subnets => this.subnets = subnets.map(s => { s.text = s.name ? s.name : s.id; return s; }),
            error => this.errorMessage = <any>error,
            () => { this.subnetsHelp = 'Select a subnet'; });
    }

    onSubNetSelect(subnet: SubNet) {
        (<FormControl>this.cloudLaunchForm.controls['subnet']).setValue(subnet.id);
    }

    getStaticIPs(cloud: Cloud) {
        this.staticIPHelp = 'Retrieving static IPs ...';
        this.staticIPs = [];
        this._cloudService.getStaticIPs(cloud.slug)
            .subscribe(ips => this.staticIPs = ips.map(s => { s.id = s.ip; s.text = s.ip; return s; }),
            error => this.errorMessage = <any>error,
            () => { this.staticIPHelp = 'Select a static IP'; });
    }

    onStaticIPSelect(staticIP: StaticIP) {
        (<FormControl>this.cloudLaunchForm.controls['staticIP']).setValue(staticIP.id);
    }

}
