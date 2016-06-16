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
import { Application, ApplicationVersion } from '../../models/application';

@Component({
   selector: 'cloudman-config',
   templateUrl: 'app/components/plugins/cloudman.component.html',
   directives: [FORM_DIRECTIVES, SELECT_DIRECTIVES, RadioControlValueAccessor, ConfigPanelComponent]
})

export class CloudManConfigComponent implements OnInit, OnDestroy {
   @Input()
   application: Application;

   @Input()
   applicationVersion: ApplicationVersion;

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
         'clusterName': ['', Validators.required],
         'clusterPassword': ['', Validators.required],
         'storageType': this.storageType,
         'storageSize': [''],
         'clusterType': ['Galaxy'],
         'defaultBucket': [''],
         'masterPostStartScript': [''],
         'workerPostStartScript': [''],
         'clusterSharedString': ['']
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
