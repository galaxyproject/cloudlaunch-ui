import { Component, View, DynamicComponentLoader, ElementRef } from 'angular2/core';

@Component({
   selector: 'galaxy-config',
   template: `<div><i>Galaxy Application template: Appliance name: {{ appliance.name }} </i></div>`,
   inputs: ['appliance']
})
export class GalaxyConfigComponent {}