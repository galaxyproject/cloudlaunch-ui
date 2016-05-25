import { Component, OnInit } from '@angular/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from '@angular/common';

import { SELECT_DIRECTIVES } from 'ng2-select';

import { Cloud, InstanceType } from '../models/cloud';
import { CloudService } from '../services/cloud.service';
import { ConfigPanelComponent } from '../layouts/config-panel.component';

@Component({
   selector: 'cloudlaunch-config',
   templateUrl: 'app/components/cloudlaunch.component.html',
   providers: [CloudService],
   directives: [ConfigPanelComponent, FORM_DIRECTIVES, SELECT_DIRECTIVES]
})

export class CloudLaunchComponent implements OnInit {
   errorMessage: string;
   showAdvanced: boolean = false;

   clouds: Cloud[] = [];
   selectedCloud: Cloud;
   instanceTypes: InstanceType[] = [];
   instanceTypeHelp: string = "Select a target cloud first";

   constructor(private _cloudService: CloudService,
      fb: FormBuilder) {
      // this.launchForm = fb.group({
      //     // 'clouds': this.clouds
      // });
   }

   ngOnInit() {
      this.getClouds();
      // this.getInstanceTypes('aws-us-east-1');
   }

   getClouds() {
      this.selectedCloud = null;
      this._cloudService.getClouds()
         .subscribe(clouds => this.clouds = clouds.map(c => { c.id = c.slug; c.text = c.name; return c; }),
         error => this.errorMessage = <any>error,
         () => console.log('Got clouds: ', this.clouds));
   }

   onCloudSelect(selected_cloud: Cloud) {
      this.getInstanceTypes(selected_cloud.id);
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
}
