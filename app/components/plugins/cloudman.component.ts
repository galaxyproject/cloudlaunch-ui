import { Component, Host, Input } from '@angular/core';
import { RadioControlValueAccessor } from "../../directives/radio_value_accessor";
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   Control,
   Validators,
   NgFormModel } from '@angular/common';

import { SELECT_DIRECTIVES } from 'ng2-select';
import { BasePluginComponent } from '../base-plugin.component';
import { ConfigPanelComponent } from '../../layouts/config-panel.component';

@Component({
   selector: 'cloudman-config',
   templateUrl: 'app/components/plugins/cloudman.component.html',
   directives: [FORM_DIRECTIVES, SELECT_DIRECTIVES, RadioControlValueAccessor, ConfigPanelComponent],
   inputs: ['initialConfig']
})

export class CloudManConfigComponent extends BasePluginComponent {
   cluster: Object = {};
   clusterTypes: Object[] = [  // First element in the list if the default choice
      {'id': 'Galaxy', 'text': 'SLURM cluster with Galaxy'},
      {'id': 'Data', 'text': 'SLURM cluster only'},
      {'id': 'None', 'text': 'Do not set cluster type now'}]
   showAdvanced: boolean = false;

   cmClusterForm: ControlGroup;
   storageType = new Control('', Validators.required);

   get form() : ControlGroup {
      return this.cmClusterForm;
   }
   
   get configName() : string {
      return "config_cloudman";
   }
      
   constructor(fb: FormBuilder, @Host() parentForm: NgFormModel) {
      super(fb, parentForm);
      this.cmClusterForm = fb.group({
         'clusterName': [null, Validators.required],
         'clusterPassword': [null, Validators.required],
         'storageType': this.storageType,
         'storageSize': [null],
         'clusterType': [null],
         'defaultBucket': [null],
         'masterPostStartScript': [null],
         'workerPostStartScript': [null],
         'clusterSharedString': [null]
      });
   }

   getInitialClusterType() : Object {
      return [this.clusterTypes[0]];
   }

   setClusterType(clusterType) {
      this.cmClusterForm.value['clusterType'] = clusterType.id;
   }

   toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
   }

}
