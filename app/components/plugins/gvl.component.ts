import { Component, OnInit, Host } from '@angular/core';
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
   inputs: ['application'],
   directives: [ConfigPanelComponent, CloudManConfigComponent]
})
export class GVLConfigComponent implements OnInit {

   gvlLaunchForm: ControlGroup;
   parentForm: NgFormModel;

   constructor(fb: FormBuilder, @Host() parentForm: NgFormModel) {
      this.gvlLaunchForm = fb.group({
         'gvlapp_cmdlineutils': [''],
         'gvlapp_smrt_analysis': ['']
      });
      this.parentForm = parentForm;
   }
   
   ngOnInit() {
      // Add child form to parent so that validations roll up
      this.parentForm.form.addControl("config_gvl", this.gvlLaunchForm);
   }
}
