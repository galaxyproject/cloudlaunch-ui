import { Component, View, DynamicComponentLoader, ElementRef } from 'angular2/core';
import {
   FORM_DIRECTIVES,
   FormBuilder,
   Validators,
   ControlGroup } from 'angular2/common';
import { Appliance } from './appliance';


@Component({
   selector: 'launch-form',
   properties: ['greeting'],
   template: `<i>{{ greeting }}</i>`
})
// @View({
//    template: `
//     <b>{{ greeting }}</b>
//   `
// })
class SomeComponent {}



@Component({
   selector: 'appliance-launch-form',
   template: `<div #container></div>`,
   //    <h3>Launch a {{ appliance.name }} appliance</h3>
   //    <form [ngFormModel]="launchForm" (submit)="doLaunch($event)">
   //       <label for="clusterName">Cluster name</label>:
   //       <input ngControl="clusterName" id="clusterName" #name="ngForm">
   //       <button type="submit">Launch</button>
   //    </form>
   // `,
   inputs: ['appliance'],
   directives: [FORM_DIRECTIVES]
})

export class ApplianceLaunchFormComponent {
   appliance: Appliance;
   launchForm: any;
   loader: DynamicComponentLoader;
   elementRef: ElementRef;

   constructor(loader: DynamicComponentLoader, elementRef: ElementRef,
               fb: FormBuilder) {
      this.loader = loader;
      this.elementRef = elementRef;

      // Some async action (maybe ajax response with html in it)
      console.log("Appliance: " + this.appliance);
      setTimeout(() => this.renderTemplate(`
         <div>
            <h2>Hello</h2>
            <launch-form greeting="Oh, hey!"></launch-form>
         </div>
      `, [SomeComponent]), 1000);

      // This does not work...
      this.launchForm = fb.group({
         'clusterName': ["", Validators.required]
      });
   }

   renderTemplate(template, directives) {
      this.loader.loadIntoLocation(
         toComponent(template, directives),
         this.elementRef,
         'container'
      )
   }

   doLaunch(event) {
      console.log(this.launchForm.value);
      event.preventDefault();
   }
}

function toComponent(template, directives=[]) {
   @Component({ selector: 'fake-component' })
   @View({ template, directives })
   class FakeComponent { }

   return FakeComponent;
}
