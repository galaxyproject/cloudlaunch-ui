import { Component, OnInit, Host } from '@angular/core';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   Control,
   Validators,
   NgFormModel} from '@angular/common';

import { SELECT_DIRECTIVES } from 'ng2-select';

import {
   Cloud,
   InstanceType,
   Region,
   PlacementZone,
   KeyPair,
   Network,
   SubNet } from '../models/cloud';
import { CloudService } from '../services/cloud.service';
import { ConfigPanelComponent } from '../layouts/config-panel.component';

@Component({
   selector: 'cloudlaunch-config',
   templateUrl: 'app/components/cloudlaunch.component.html',
   providers: [CloudService],
   inputs: ['cloudId'],
   directives: [ConfigPanelComponent, FORM_DIRECTIVES, SELECT_DIRECTIVES]
})

export class CloudLaunchComponent implements OnInit {
   _cloudId: string;

   set cloudId(value) {
      this._cloudId = value;
      this.onCloudSelect(value);
   }

   get cloudId() {
      return this._cloudId;
   }

   CLOUD_SELECTION_HELP: string = "Select a target cloud first";
   errorMessage: string;
   showAdvanced: boolean = false;
   cloudFields = true; // Used to reset form fields that are dependent on cloud selection
                       // See 'reset' on https://angular.io/docs/ts/latest/guide/forms.html

   cloudLaunchForm: ControlGroup;
   parentForm: NgFormModel;
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

   constructor(private _cloudService: CloudService, fb: FormBuilder, @Host() parentForm: NgFormModel) {
      this.cloudLaunchForm = fb.group({
         'instanceType': ['', Validators.required],
         'region': [''],
         'placementZone': [''],
         'keyPair': [''],
         'network': [''],
         'subnet': [''],
         'provider_settings': fb.group({
            'ebsOptimised': [''],
            'volumeIOPS': [''],
         })
      });
      this.parentForm = parentForm;
   }

   ngOnInit() {
      // Add child form to parent so that validations roll up
      this.parentForm.form.addControl("config_cloudlaunch", this.cloudLaunchForm);
   }

   onCloudSelect(cloudId: string) {
      this.cloudFields = false;
      setTimeout(() => this.cloudFields = true, 0);
      // Fetch options for the newly selected cloud
      this.getInstanceTypes(cloudId);
      this.getRegions(cloudId);
      this.getKeyPairs(cloudId);
      this.getNetworks(cloudId);
   }

   getInstanceTypes(cloudId: string) {
      this.instanceTypeHelp = "Retrieving instance types...";
      this.instanceTypes = [];
      this._cloudService.getInstanceTypes(cloudId)
         .subscribe(instanceTypes => this.instanceTypes = instanceTypes.map(t => { t.text = t.name; return t; }),
         error => this.errorMessage = <any>error,
         () => { this.instanceTypeHelp = "Select an Instance Type"; console.log('got instance types: ', this.instanceTypes) });
   }

   onInstanceTypeSelect(instanceType: InstanceType) {
      (<Control>this.cloudLaunchForm.controls['instanceType']).updateValue(instanceType.id);
   }

   toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
   }

   getRegions(cloudId: string) {
       this.regionHelp = "Retrieving list of regions...";
       (<Control>this.cloudLaunchForm.controls['region']).updateValue(null);
       this.placementHelp = "Select a region first";
       this.regions = [];
       this._cloudService.getRegions(cloudId)
           .subscribe(regions => this.regions = regions.map(n => { n.text = n.name ? n.name : n.id; return n; }),
           error => this.errorMessage = <any>error,
           () => { this.regionHelp = "Select a region" });
   }

   onRegionSelect(region: Region) {
       (<Control>this.cloudLaunchForm.controls['region']).updateValue(region.id);
       this.getPlacements(this.cloudId, region.id);
   }

   getPlacements(cloudId: string, region: string) {
      this.placementHelp = "Retrieving placement options...";
      this.placements = [];
      this._cloudService.getPlacementZones(cloudId, region)
         .subscribe(placements => this.placements = placements.map(p => { p.text = p.name; return p; }),
         error => this.errorMessage = <any>error,
         () => { this.placementHelp = "Select a placement" });
   }

   onPlacementSelect(placement: PlacementZone) {
      (<Control>this.cloudLaunchForm.controls['placementZone']).updateValue(placement.id);
   }


   getKeyPairs(cloudId: string) {
      this.keypairsHelp = "Retrieving keypairs...";
      this.keypairs = [];
      this._cloudService.getKeyPairs(cloudId)
         .subscribe(keypairs => this.keypairs = keypairs.map(kp => { kp.text = kp.name; return kp; }),
         error => this.errorMessage = <any>error,
         () => { this.keypairsHelp = "Select a keypair" });
   }

   onKeyPairSelect(kp: KeyPair) {
      (<Control>this.cloudLaunchForm.controls['keyPair']).updateValue(kp.id);
   }

   getNetworks(cloudId: string) {
      this.networksHelp = "Retrieving list of networks...";
      (<Control>this.cloudLaunchForm.controls['network']).updateValue(null);
      this.subnetsHelp = "Select a network first";
      this.networks = [];
      this._cloudService.getNetworks(cloudId)
         .subscribe(networks => this.networks = networks.map(n => { n.text = n.name ? n.name : n.id; return n; }),
         error => this.errorMessage = <any>error,
         () => { this.networksHelp = "Select a network" });
   }

   onNetworkSelect(network: Network) {
      (<Control>this.cloudLaunchForm.controls['network']).updateValue(network.id);
      this.getSubnets(this.cloudId, network.id);
   }

   getSubnets(cloudId: string, networkId: string) {
      this.subnetsHelp = "Retrieving list of subnets...";
      this.subnets = [];
      this._cloudService.getSubNets(cloudId, networkId)
         .subscribe(subnets => this.subnets = subnets.map(s => { s.text = s.name ? s.name : s.id; return s; }),
         error => this.errorMessage = <any>error,
         () => { this.subnetsHelp = "Select a subnet" });
   }

   onSubNetSelect(subnet: SubNet) {
      (<Control>this.cloudLaunchForm.controls['subnet']).updateValue(subnet.id);
   }

}
