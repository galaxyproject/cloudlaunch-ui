import { Component, View, DynamicComponentLoader, ElementRef } from '@angular/core';

@Component({
   selector: 'galaxy-config',
   template: `<div><i>Galaxy Application template: Appliance name: {{ application.name }} </i></div>`,
   inputs: ['application']
})
export class GalaxyConfigComponent {}
