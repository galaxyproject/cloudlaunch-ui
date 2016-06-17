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
import { BasePluginComponent } from '../base-plugin.component';

@Component({
   selector: 'gvl-config',
   templateUrl: 'app/components/plugins/gvl.component.html',
   directives: [ConfigPanelComponent, CloudManConfigComponent],
   inputs: ['initialConfig']
})
export class GVLConfigComponent extends BasePluginComponent {

   gvlLaunchForm: ControlGroup;
   
   get form() : ControlGroup {
      return this.gvlLaunchForm;
   }
   
   get configName() : string {
      return "config_gvl";
   }

   constructor(fb: FormBuilder, @Host() parentForm: NgFormModel) {
      super(fb, parentForm);
      this.gvlLaunchForm = fb.group({
         'gvl_cmdline_utilities': [''],
         'smrt_portal': ['']
      });
   }
}
