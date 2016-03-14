import { Component, DynamicComponentLoader, ElementRef, OnInit } from 'angular2/core';
import { Application } from '../models/application';


@Component({
   selector: 'app-placeholder',
   template: `<span #content></span>`,
   inputs: ['application', 'component_path', 'component_name'],
})
export class AppPlaceHolderComponent implements OnInit {
   application: Application;
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
               res.instance.application = this.application;
          });
        });
   }

}