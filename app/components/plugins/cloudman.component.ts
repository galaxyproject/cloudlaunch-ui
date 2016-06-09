import { Component } from '@angular/core';
import { ConfigPanelComponent } from '../../layouts/config-panel.component';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   AbstractControl} from '@angular/common';
import { Router, RouteParams } from '@angular/router-deprecated';

import { CloudLaunchComponent } from '../cloudlaunch.component';
// import { CloudManCloud } from './cloudmancloud.component';

// @RouteConfig([
//    {path: '/cloud', component: CloudManCloud, name: 'CMCloud', useAsDefault: true}
// ])

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
                FORM_DIRECTIVES]
})

export class CloudManConfigComponent {
   cluster: Object = {};
   clusterTypes: Object[] = [  // First element in the list if the default choice
      {'value': 'Data', 'title': 'SLURM cluster only'},
      {'value': 'Galaxy', 'title': 'SLURM cluster with Galaxy'},
      {'value': 'None', 'title': 'Do not set cluster type now'}]
   storageType: string = "transient";  // Init default type: transient or volume
   showAdvanced: boolean = false;
   showCloudLaunch: boolean = false;

   clusterForm: ControlGroup;
   clusterName: AbstractControl;
   cmConfigService: CloudManConfigService;
   // clusterConfig: Config;
   private router: Router;
   private routeParams: RouteParams;
   constructor(fb: FormBuilder, configService: CloudManConfigService,
      cmConfigService: CloudManConfigService, _router: Router,
      private _routerParams: RouteParams) {
      this.router = _router;
      this.routeParams = _routerParams
      // console.log("routeParams: ", this.routeParams);
      // this.clusterConfig = cmConfigService.configInfo();
      this.cmConfigService = cmConfigService;
      this.clusterForm = fb.group({
         'cluster_name': [''],
         'password': ['']
      });

      this.clusterName = this.clusterForm.controls['cluster_name'];
   }

   onSubmit(value: string): void {
      console.log("onSubmit value: ", value);
      // this.cmConfigService.storeInfo(value['cluster_name']);
   }

   setStorage(sType) {
      this.storageType = sType;
      console.log(this.storageType);
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
