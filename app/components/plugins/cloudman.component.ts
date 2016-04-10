import { Component, View, DynamicComponentLoader, ElementRef } from 'angular2/core';
import { ConfigPanelComponent } from '../../layouts/config-panel.component';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   AbstractControl} from 'angular2/common';
import { Router, RouteParams } from 'angular2/router';

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
         'cluster_name': ['']
      });

      this.clusterName = this.clusterForm.controls['cluster_name'];
   }

   onSubmit(value: string): void {
      console.log("onSubmit value: ", value);
      this.cmConfigService.storeInfo(value['cluster_name']);
      // this.router.navigate(['Launch', {slug: this.routeParams.get('slug')}]);
   }

   setStorage(sType) {
      this.storageType = sType;
      console.log(this.storageType);
   }

   toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
   }

   // launch() {
   //    console.log("CMConfigComponent launch method");
   // }
}
