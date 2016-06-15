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
import { Application, ApplicationVersion } from '../../models/application';

@Component({
   selector: 'gvl-config',
   templateUrl: 'app/components/plugins/gvl.component.html',
   directives: [ConfigPanelComponent, CloudManConfigComponent]
})
export class GVLConfigComponent implements OnInit, OnDestroy {
   @Input()
   application: Application;
   
   @Input()
   applicationVersion: ApplicationVersion;
   
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
   
   ngOnDestroy() {
      this.parentForm.form.removeControl("config_gvl");
   }
}
