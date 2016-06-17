import { OnInit, OnDestroy, Input, Host } from '@angular/core';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   ControlGroup,
   Control,
   Validators,
   NgFormModel } from '@angular/common';

// Provides automatic initialisation of form values based on an initial Config
// dictionary. Inheriting classes must implement the methods configName
// and initialConfig. This class will walk through the initialConfig object,
// setting form values as appropriate.
export abstract class BasePluginComponent implements OnInit, OnDestroy {
   private _initialConfig: any;
   private parentForm: NgFormModel;
   
   get form() : ControlGroup {
      throw new TypeError("get form must be implemented");
   }
   
   get configName() : string {
      throw new TypeError("get configName must be implemented");
   }
   
   get initialConfig() {
      return this._initialConfig;
   }
   
   set initialConfig(value) {
      this._initialConfig = value;
      if (value && value[this.configName]) {
         this.setControlValuesRecurse(<ControlGroup>this.form, value[this.configName]);
      }
   }
   
   setControlValuesRecurse(group: ControlGroup, value: any) {
      for (let controlName in group.controls) {
         let ctrl = group.controls[controlName];
         if (ctrl instanceof ControlGroup && value[controlName]) {
            this.setControlValuesRecurse(<ControlGroup>ctrl, value[controlName]);
         }
         else if (value[controlName]) {
            (<Control>ctrl).updateValue(value[controlName] || null);
         }
      }
   }
   
   constructor(fb: FormBuilder, @Host() parentForm: NgFormModel) {
      this.parentForm = parentForm;
   }
   
   ngOnInit() {
      // Add child form to parent so that validations roll up
      this.parentForm.form.addControl(this.configName, this.form);
   }
   
   ngOnDestroy() {
      this.parentForm.form.removeControl(this.configName);
   }
}
