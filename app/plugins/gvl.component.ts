import { Component, View, DynamicComponentLoader, ElementRef } from 'angular2/core';

@Component({
   selector: 'gvl-config',
   template: `<div><i>GVL application template: appliance name {{ appliance.name }} </i></div>`,
   inputs: ['appliance']
})
export class GVLConfigComponent {}