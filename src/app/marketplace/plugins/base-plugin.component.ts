import { OnInit, OnDestroy, Input, Host } from '@angular/core';
import {
   FormBuilder,
   FormGroup,
   FormControl,
   Validators,
   ControlContainer} from '@angular/forms';

// Provides automatic initialisation of form values based on an initial Config
// dictionary. Inheriting classes must implement the methods configName
// and initialConfig. This class will walk through the initialConfig object,
// setting form values as appropriate.
export abstract class BasePluginComponent implements OnInit, OnDestroy {
   private _initialConfig: any;
   private parentForm: FormGroup;
   
   get form() : FormGroup {
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
         this.setControlValuesRecurse(<FormGroup>this.form, value[this.configName]);
      }
   }
   
   setControlValuesRecurse(group: FormGroup, value: any) {
      for (let controlName in group.controls) {
         let ctrl = group.controls[controlName];
         if (ctrl instanceof FormGroup && value[controlName]) {
            this.setControlValuesRecurse(<FormGroup>ctrl, value[controlName]);
         }
         else if (value[controlName]) {
            (<FormControl>ctrl).setValue(value[controlName] || null);
         }
      }
   }
   
   constructor(fb: FormBuilder, @Host() parentContainer: ControlContainer) {
       this.parentForm = <FormGroup>(parentContainer["form"]);
   }
   
   ngOnInit() {
      // Add child form to parent so that validations roll up
      this.parentForm.addControl(this.configName, this.form);
   }
   
   ngOnDestroy() {
      this.parentForm.removeControl(this.configName);
   }
}
