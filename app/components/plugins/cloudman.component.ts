import { Component, OnInit, OnDestroy, Host, Input } from '@angular/core';
import { RadioControlValueAccessor } from "../../directives/radio_value_accessor";
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   Control,
   Validators,
   NgFormModel } from '@angular/common';

import { SELECT_DIRECTIVES } from 'ng2-select';
import { ConfigPanelComponent } from '../../layouts/config-panel.component';

@Component({
   selector: 'cloudman-config',
   templateUrl: 'app/components/plugins/cloudman.component.html',
   directives: [FORM_DIRECTIVES, SELECT_DIRECTIVES, RadioControlValueAccessor, ConfigPanelComponent],
   inputs: ['initialConfig']
})

export class CloudManConfigComponent implements OnInit, OnDestroy {
   _initialConfig: any;
   
   get initialConfig() {
      return this._initialConfig;
   }
   
   set initialConfig(value) {
      this._initialConfig = value;
      if (value && value.config_cloudman) {
         let form = <Control>this.cmClusterForm;
         form.controls['clusterName'].updateValue(value.config_cloudman.clusterName || null);
         form.controls['clusterPassword'].updateValue(value.config_cloudman.clusterPassword || null);
         form.controls['clusterType'].updateValue(value.config_cloudman.clusterType || null);
         form.controls['defaultBucket'].updateValue(value.config_cloudman.defaultBucket || null);
         form.controls['masterPostStartScript'].updateValue(value.config_cloudman.masterPostStartScript || null);
         form.controls['workerPostStartScript'].updateValue(value.config_cloudman.workerPostStartScript || null);
         form.controls['clusterSharedString'].updateValue(value.config_cloudman.clusterSharedString || null);
      }
   }


   cluster: Object = {};
   clusterTypes: Object[] = [  // First element in the list if the default choice
      {'id': 'Galaxy', 'text': 'SLURM cluster with Galaxy'},
      {'id': 'Data', 'text': 'SLURM cluster only'},
      {'id': 'None', 'text': 'Do not set cluster type now'}]
   showAdvanced: boolean = false;

   cmClusterForm: ControlGroup;
   storageType = new Control('transient', Validators.required);
   parentForm: NgFormModel;

   constructor(fb: FormBuilder, @Host() parentForm: NgFormModel) {
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
      this.parentForm = parentForm;
   }

   ngOnInit() {
      // Add child form to parent so that validations roll up
      this.parentForm.form.addControl("config_cloudman", this.cmClusterForm);
   }

   ngOnDestroy() {
      this.parentForm.form.removeControl("config_cloudman");
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
