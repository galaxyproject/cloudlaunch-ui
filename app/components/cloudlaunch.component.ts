import { Component, OnInit } from '@angular/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from '@angular/common';

import { SELECT_DIRECTIVES } from 'ng2-select';

import { Cloud, InstanceType, Placement, KeyPair, Network, SubNet } from '../models/cloud';
import { CloudService } from '../services/cloud.service';
import { ConfigPanelComponent } from '../layouts/config-panel.component';

@Component({
   selector: 'cloudlaunch-config',
   templateUrl: 'app/components/cloudlaunch.component.html',
   providers: [CloudService],
   directives: [ConfigPanelComponent, FORM_DIRECTIVES, SELECT_DIRECTIVES]
})

export class CloudLaunchComponent implements OnInit {
   CLOUD_SELECTION_HELP: string = "Select a target cloud first";
   errorMessage: string;
   showAdvanced: boolean = false;

   clouds: Cloud[] = [];
   selectedCloud: Cloud;
   instanceTypes: InstanceType[] = [];
   instanceTypeHelp: string = this.CLOUD_SELECTION_HELP;
   placements: Placement[] = [];
   placementHelp: string = this.CLOUD_SELECTION_HELP;
   keypairs: KeyPair[] = [];
   keypairsHelp: string = this.CLOUD_SELECTION_HELP;
   networks: Network[] = [];
   networksHelp: string = this.CLOUD_SELECTION_HELP;
   selectedNetwork: Network;
   subnets: SubNet[] = [];
   subnetsHelp: string = this.CLOUD_SELECTION_HELP;

   constructor(private _cloudService: CloudService, fb: FormBuilder) { }

   ngOnInit() {
      this.getClouds();
   }

   getClouds() {
      this.selectedCloud = null;
      this._cloudService.getClouds()
         .subscribe(clouds => this.clouds = clouds.map(c => { c.id = c.slug; c.text = c.name; return c; }),
         error => this.errorMessage = <any>error,
         () => console.log('Got clouds: ', this.clouds));
   }

   onCloudSelect(selected_cloud: Cloud) {
      this.selectedCloud = selected_cloud;
      this.getInstanceTypes(selected_cloud.id);
      this.getPlacements(selected_cloud.id);
      this.getKeyPairs(selected_cloud.id);
      this.getNetworks(selected_cloud.id);
   }

   getInstanceTypes(slug: string) {
      this.instanceTypeHelp = "Retrieving instance types...";
      this.instanceTypes = [];
      this._cloudService.getInstanceTypes(slug)
         .subscribe(instanceTypes => this.instanceTypes = instanceTypes.map(t => { t.text = t.name; return t; }),
         error => this.errorMessage = <any>error,
         () => { this.instanceTypeHelp = "Select an Instance Type"; console.log('got instance types: ', this.instanceTypes) });
   }

   toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
   }

   getPlacements(cloud_id: string) {
      this.placementHelp = "Retrieving placement options...";
      this.placements = [];
      this._cloudService.getPlacements(cloud_id)
         .subscribe(placements => this.placements = placements.map(p => { p.text = p.name; return p; }),
         error => this.errorMessage = <any>error,
         () => { this.placementHelp = "Select a placement" });
   }

   getKeyPairs(cloud_id: string) {
      this.keypairsHelp = "Retrieving keypairs...";
      this.keypairs = [];
      this._cloudService.getKeyPairs(cloud_id)
         .subscribe(keypairs => this.keypairs = keypairs.map(kp => { kp.text = kp.name; return kp; }),
         error => this.errorMessage = <any>error,
         () => { this.keypairsHelp = "Select a keypair" });
   }

   getNetworks(cloud_id: string) {
      this.networksHelp = "Retrieving list of networks...";
      this.selectedNetwork = null;
      this.subnetsHelp = "Select a network first";
      this.networks = [];
      this._cloudService.getNetworks(cloud_id)
         .subscribe(networks => this.networks = networks.map(n => { n.text = n.name ? n.name : n.id; return n; }),
         error => this.errorMessage = <any>error,
         () => { this.networksHelp = "Select a network" });
   }

   onNetworkSelect(selected_network: Network) {
      this.getSubnets(this.selectedCloud.id, selected_network.id);
   }

   getSubnets(cloud_id: string, network_id: string) {
      this.subnetsHelp = "Retrieving list of subnets...";
      this.subnets = [];
      this._cloudService.getSubNets(cloud_id, network_id)
         .subscribe(subnets => this.subnets = subnets.map(s => { s.text = s.name ? s.name : s.id; return s; }),
         error => this.errorMessage = <any>error,
         () => { this.subnetsHelp = "Select a subnet" });
   }
}
