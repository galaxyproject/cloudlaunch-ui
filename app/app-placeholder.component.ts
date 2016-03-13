import { Component, View, DynamicComponentLoader, ElementRef, OnInit } from 'angular2/core';
import { Appliance } from './appliance';


@Component({
   selector: 'app-placeholder',
   template: `<span #content></span>`,
   inputs: ['appliance', 'component_path', 'component_name'],
})
export class AppPlaceHolderComponent implements OnInit {
   appliance: Appliance;
   component_name: string;
   component_path: string;
   loader: DynamicComponentLoader;
   element_ref: ElementRef;

   constructor(loader: DynamicComponentLoader, el: ElementRef) {
      this.loader = loader;
      this.element_ref = el;
   }

   ngOnInit() {
      System.import(this.component_path)
        .then(m => {
          this.loader.loadIntoLocation(m[this.component_name], this.element_ref, 'content')
            .then(res => {
               // set inputs
               res.instance.appliance = this.appliance;
          });
        });
   }

}