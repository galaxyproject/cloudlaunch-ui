import { Component } from '@angular/core';
import { ConfigPanelComponent } from '../../layouts/config-panel.component';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   Control} from '@angular/common';

import { SELECT_DIRECTIVES } from 'ng2-select';

import { CloudLaunchComponent } from '../cloudlaunch.component';

class Config {
   clusterName: string;
}

export class CloudManConfigService {
   c: Config;

   storeInfo(cn: string) {
      let lc = new Config();
      lc.clusterName = cn;
      this.c = lc;
   }

   configInfo() {
      console.log("CMConfigService");
      console.log("cn: ", this.c.clusterName);
      // return this.c;
   }
}

@Component({
   selector: 'cloudman-config',
   templateUrl: 'app/components/plugins/cloudman.component.html',
   inputs: ['application'],
   providers: [CloudManConfigService],
   directives: [ConfigPanelComponent, CloudLaunchComponent,
                FORM_DIRECTIVES, SELECT_DIRECTIVES]
})

export class CloudManConfigComponent {
   cluster: Object = {};
   clusterTypes: Object[] = [  // First element in the list if the default choice
      {'id': 'Data', 'text': 'SLURM cluster only'},
      {'id': 'Galaxy', 'text': 'SLURM cluster with Galaxy'},
      {'id': 'None', 'text': 'Do not set cluster type now'}]
   // storageType: string = "transient";  // Form flag: transient or volume
   showAdvanced: boolean = false;

   cmClusterForm: ControlGroup;
   cmStorageType: Control = new Control('transient');
   cmClusterType: Control;

   cmConfigService: CloudManConfigService;
   // clusterConfig: Config;

   constructor(fb: FormBuilder, configService: CloudManConfigService,
               cmConfigService: CloudManConfigService) {
      this.cmConfigService = cmConfigService;
      this.cmClusterForm = fb.group({
         'cmClusterName': [''],
         'cmPassword': [''],
         'cmStorageType': this.cmStorageType,
         'cmStorageSize': [''],
         'cmClusterType': this.cmClusterType,
         'cmDefaultBucket': [''],
         'cmPSS': [''],
         'cmWPSS': [''],
         'cmShareString': ['']
      });
   }

   onSubmit(value: string): void {
      // `cmStorageType` and `cmClusterType` form fields do not get get updated
      // as expected so sync them with the component properties
      if (value['cmStorageType'] != this.cmStorageType.value) {
         value['cmStorageType'] = this.cmStorageType.value;
      }

      if (value['cmClusterType'] == "" || value['cmClusterType'] == null) {
         if (this.cmClusterType == null) {
            // Default cluster type for the current appliance
            // TODO: set this as @Input based on the appliance
            value['cmClusterType'] = 'Data';
         } else {
            value['cmClusterType'] = this.cmClusterType.value;
         }
      }
      console.log("onSubmit value: ", value);
      // this.cmConfigService.storeInfo(value['cluster_name']);
   }

   setStorageType(sType) {
      console.log(sType);
      this.cmStorageType = new Control(sType);
   }

   setClusterType(cType) {
       console.log(cType);
       this.cmClusterType = new Control(cType.id);
       // console.log(this.cmClusterType);
   }

   setTargetCloud(targetCloud) {
      console.log("Target cloud in the CloudMan component: " + targetCloud.id);
   }

   setInstanceType(instanceType) {
      console.log("Instance type in the CloudMan component: " + instanceType.id);
   }

   setPlacement(placement) {
      console.log("Placement in the CloudMan component: " + placement.id);
   }

   setKeypair(keypair) {
      console.log("Key pair in the CloudMan component: " + keypair.id);
   }

   setNetwork(network) {
      console.log("Network in the CloudMan component: " + network.id);
   }

   setSubnet(subnet) {
      console.log("Subnet in the CloudMan component: " + subnet.id);
   }

   setEbsOptimized(ebsOptimized) {
      console.log(ebsOptimized);
   }

   setIops(iops) {
      console.log(iops);
   }

   toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
   }

   // launch() {
   //    console.log("CMConfigComponent launch method");
   // }
}
