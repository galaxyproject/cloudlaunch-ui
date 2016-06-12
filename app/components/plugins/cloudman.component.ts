import { Component } from '@angular/core';
import { ConfigPanelComponent } from '../../layouts/config-panel.component';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   Control} from '@angular/common';

import { SELECT_DIRECTIVES } from 'ng2-select';

import { CloudLaunchComponent } from '../cloudlaunch.component';
import { TargetCloudInfo } from '../../models/cloud';

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
   cloudInfo: TargetCloudInfo = new TargetCloudInfo();
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

   onSubmit(formValues: string): void {
      // `cmStorageType` and `cmClusterType` form fields do not get get updated
      // as expected so sync them with the component properties
      if (formValues['cmStorageType'] != this.cmStorageType.value) {
         formValues['cmStorageType'] = this.cmStorageType.value;
      }

      if (formValues['cmClusterType'] == "" || formValues['cmClusterType'] == null) {
         if (this.cmClusterType == null) {
            // Default cluster type for the current appliance
            // TODO: set this as @Input based on the appliance
            formValues['cmClusterType'] = 'Data';
         } else {
            formValues['cmClusterType'] = this.cmClusterType.value;
         }
      }
      console.log("onSubmit formValues: ", formValues);
      console.log(this.cloudInfo);
      // this.cmConfigService.storeInfo(formValues['cluster_name']);
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
      this.cloudInfo.cloudId = targetCloud.id;
   }

   setInstanceType(instanceType) {
      console.log("Instance type in the CloudMan component: " + instanceType.id);
      this.cloudInfo.instanceType = instanceType.id;
   }

   setPlacement(placement) {
      console.log("Placement in the CloudMan component: " + placement.id);
      this.cloudInfo.placement = placement.id;
   }

   setKeypair(keypair) {
      console.log("Key pair in the CloudMan component: " + keypair.id);
      this.cloudInfo.keypair = keypair.id;
   }

   setNetwork(network) {
      console.log("Network in the CloudMan component: " + network.id);
      this.cloudInfo.network = network.id;
   }

   setSubnet(subnet) {
      console.log("Subnet in the CloudMan component: " + subnet.id);
      this.cloudInfo.subnet = subnet.id;
   }

   setEbsOptimized(ebsOptimized) {
      console.log(ebsOptimized);
      this.cloudInfo.ebsOptimized = ebsOptimized.id;
   }

   setIops(iops) {
      console.log(iops);
      this.cloudInfo.iops = iops.id;
   }

   toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
   }

   // launch() {
   //    console.log("CMConfigComponent launch method");
   // }
}
