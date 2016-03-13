import { Component, DynamicComponentLoader, ElementRef, OnInit } from 'angular2/core';
import { Appliance } from '../models/appliance';


@Component({
   selector: 'app-placeholder',
   template: `<span #content></span>`,
   inputs: ['appliance', 'component_path', 'component_name'],
})
export class AppPlaceHolderComponent implements OnInit {
   appliance: Appliance;
   component_name: string;
   component_path: string;

   constructor(
      private _loader: DynamicComponentLoader,
      private _element_ref: ElementRef) {
   }

   ngOnInit() {
      System.import(this.component_path)
        .then(m => {
          this._loader.loadIntoLocation(m[this.component_name], this._element_ref, 'content')
            .then(res => {
               // set inputs
               res.instance.appliance = this.appliance;
          });
        });
   }

}