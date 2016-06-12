import { Component, ViewContainerRef, ComponentResolver, OnInit } from '@angular/core';
import { Application } from '../models/application';

declare var System: any;

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
      private viewContainerRef: ViewContainerRef,
      private componentResolver: ComponentResolver) {
   }

   ngOnInit() {
      System.import(this.component_path)
        .then(m => {
          this.componentResolver.resolveComponent(m[this.component_name]).then((factory) => {
            let component = this.viewContainerRef.createComponent(factory, 0,  this.viewContainerRef.injector);
            component.instance.application = this.application;  
          });
        });
   }

}
