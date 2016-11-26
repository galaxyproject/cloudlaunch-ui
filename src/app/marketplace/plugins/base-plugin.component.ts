import { OnInit, OnDestroy, Input, Host } from '@angular/core';
import {
   FormBuilder,
   FormGroup,
   FormControl,
   Validators,
   FormGroupDirective} from '@angular/forms';

// Provides automatic initialisation of form values based on an initial Config
// dictionary. Inheriting classes must implement the methods configName
// and initialConfig. This class will walk through the initialConfig object,
// setting form values as appropriate.
export abstract class BasePluginComponent implements OnInit, OnDestroy {
   private _initialConfig: any;
   
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
          // Recursively set initial values on controls
          this.form.patchValue(value[this.configName]);
      }
   }
   
   constructor(fb: FormBuilder, private parentContainer: FormGroupDirective) {
   }
   
   ngOnInit() {
      // Add child form to parent so that validations roll up
      this.parentContainer.form.addControl(this.configName, this.form);
   }
   
   ngOnDestroy() {
       this.parentContainer.form.removeControl(this.configName);
   }
}
