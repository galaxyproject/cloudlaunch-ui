import { Component, OnInit, Host } from '@angular/core';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   Control,
   Validators,
   NgFormModel} from '@angular/common';

import { SELECT_DIRECTIVES } from 'ng2-select';

import { Cloud, InstanceType, Placement, KeyPair, Network, SubNet } from '../models/cloud';
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
   placements: Placement[] = [];
   placementHelp: string = this.CLOUD_SELECTION_HELP;
   keypairs: KeyPair[] = [];
   keypairsHelp: string = this.CLOUD_SELECTION_HELP;
   networks: Network[] = [];
   networksHelp: string = this.CLOUD_SELECTION_HELP;
   subnets: SubNet[] = [];
   subnetsHelp: string = this.CLOUD_SELECTION_HELP;

   constructor(private _cloudService: CloudService, fb: FormBuilder, @Host() parentForm: NgFormModel) {
      this.cloudLaunchForm = fb.group({
         'instanceType': [''],
         'placementZone': [''],
         'keyPair': [''],
         'network': [''],
         'subnet': [''],
         'ebsOptimised': [''],
         'volumeIOPS': [''],
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
      this.getPlacements(cloudId);
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

   setInstanceType(instanceType: InstanceType) {
      this.cloudLaunchForm.value['instanceType'] = instanceType.id;
   }

   toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
   }

   getPlacements(cloudId: string) {
      this.placementHelp = "Retrieving placement options...";
      this.placements = [];
      this._cloudService.getPlacements(cloudId)
         .subscribe(placements => this.placements = placements.map(p => { p.text = p.name; return p; }),
         error => this.errorMessage = <any>error,
         () => { this.placementHelp = "Select a placement" });
   }

   getKeyPairs(cloudId: string) {
      this.keypairsHelp = "Retrieving keypairs...";
      this.keypairs = [];
      this._cloudService.getKeyPairs(cloudId)
         .subscribe(keypairs => this.keypairs = keypairs.map(kp => { kp.text = kp.name; return kp; }),
         error => this.errorMessage = <any>error,
         () => { this.keypairsHelp = "Select a keypair" });
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
}
