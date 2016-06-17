import { Component, OnInit, OnDestroy, Host, Input } from '@angular/core';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   Control,
   Validators,
   NgFormModel } from '@angular/common';
import { ConfigPanelComponent } from '../../layouts/config-panel.component';
import { CloudManConfigComponent } from './cloudman.component';

@Component({
   selector: 'gvl-config',
   templateUrl: 'app/components/plugins/gvl.component.html',
   directives: [ConfigPanelComponent, CloudManConfigComponent]
   inputs: ['initialConfig']
})
export class GVLConfigComponent implements OnInit, OnDestroy {
   _initialConfig: any;
   
   get initialConfig() {
      return this._initialConfig;
   }
   
   set initialConfig(value) {
      this._initialConfig = value;
      if (value && value.config_gvl) {
         let form = <Control>this.gvlLaunchForm;
         form.controls['gvl_cmdline_utilities'].updateValue(value.config_gvl.gvl_cmdline_utilities || null);
         form.controls['smrt_portal'].updateValue(value.config_gvl.smrt_portal || null);
      }
   }

   gvlLaunchForm: ControlGroup;
   parentForm: NgFormModel;

   constructor(fb: FormBuilder, @Host() parentForm: NgFormModel) {
      this.gvlLaunchForm = fb.group({
         'gvl_cmdline_utilities': [''],
         'smrt_portal': ['']
      });
      this.parentForm = parentForm;
   }
   
   ngOnInit() {
      // Add child form to parent so that validations roll up
      this.parentForm.form.addControl("config_gvl", this.gvlLaunchForm);
   }
   
   ngOnDestroy() {
      this.parentForm.form.removeControl("config_gvl");
   }
}
