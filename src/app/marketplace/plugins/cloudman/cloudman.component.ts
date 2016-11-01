import { Component, Host, Input } from '@angular/core';
import {
   FormBuilder,
   FormGroup,
   FormControl,
   Validators, ControlContainer } from '@angular/forms';

import { BasePluginComponent } from '../base-plugin.component';
import { ConfigPanelComponent } from '../../../shared/layouts/config-panel.component';

@Component({
   selector: 'cloudman-config',
   templateUrl: './cloudman.component.html',
   inputs: ['initialConfig']
})

export class CloudManConfigComponent extends BasePluginComponent {
   cluster: Object = {};
   clusterTypes: Object[] = [  // First element in the list if the default choice
      {'id': 'Galaxy', 'text': 'SLURM cluster with Galaxy'},
      {'id': 'Data', 'text': 'SLURM cluster only'},
      {'id': 'None', 'text': 'Do not set cluster type now'}]
   showAdvanced: boolean = false;

   cmClusterForm: FormGroup;
   storageType = new FormControl('', Validators.required);

   get form() : FormGroup {
      return this.cmClusterForm;
   }

   get configName() : string {
      return "config_cloudman";
   }

   constructor(fb: FormBuilder, @Host() parentContainer: ControlContainer) {
      super(fb, <FormGroup>(parentContainer["form"]));
      let test = <FormGroup>(parentContainer["form"]);
      debugger;
      this.cmClusterForm = fb.group({
         'clusterPassword': [null, Validators.required],
         'storageType': this.storageType,
         'storageSize': [null],
         'clusterType': [null],
         'defaultBucket': [null, Validators.required],
         'masterPostStartScript': [null],
         'workerPostStartScript': [null],
         'clusterSharedString': [null]
      });
   }

   getInitialClusterType() : Object {
      return [this.clusterTypes[0]];
   }

   setClusterType(clusterType: any) {
      this.cmClusterForm.value['clusterType'] = clusterType.id;
   }

   toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
   }

}
