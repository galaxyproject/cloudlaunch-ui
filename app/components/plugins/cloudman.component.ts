import { Component, View, DynamicComponentLoader, ElementRef } from 'angular2/core';

@Component({
   selector: 'cloudman-config',
   templateUrl: 'app/components/plugins/cloudman.component.html',
   inputs: ['application']
})
export class CloudManConfigComponent {}