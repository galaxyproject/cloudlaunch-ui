import { Component } from 'angular2/core';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   Validators,
   ControlGroup } from 'angular2/common';
import { Appliance } from './appliance';

@Component({
   selector: 'appliance-launch-form',
   template: `
      <h3>Launch a {{ appliance.name }} appliance</h3>
      <form [ngFormModel]="launchForm" (submit)="doLaunch($event)">
         <label for="clusterName">Cluster name</label>:
         <input ngControl="clusterName" id="clusterName" #name="ngForm">
         <button type="submit">Launch</button>
      </form>
   `,
   inputs: ['appliance'],
   directives: [FORM_DIRECTIVES]
})

export class ApplianceLaunchFormComponent {
   appliance: Appliance;
   launchForm: any;

   constructor(fb: FormBuilder) {
      // This does not work...
      this.launchForm = fb.group({
         'clusterName': ["", Validators.required]
      });
   }

   doLaunch(event) {
      console.log(this.launchForm.value);
      event.preventDefault();
   }
}
