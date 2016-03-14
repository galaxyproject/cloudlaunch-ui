import { Component, View, DynamicComponentLoader, ElementRef } from 'angular2/core';

@Component({
   selector: 'gvl-config',
   template: `<div><i>GVL application template: appliance name {{ application.name }} </i></div>`,
   inputs: ['application']
})
export class GVLConfigComponent {}