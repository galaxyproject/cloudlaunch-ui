import { Component, View, DynamicComponentLoader, ElementRef } from 'angular2/core';
import { ConfigPanelComponent } from '../../layouts/config-panel.component';

@Component({
   selector: 'cloudman-config',
   templateUrl: 'app/components/plugins/cloudman.component.html',
   inputs: ['application'],
   directives: [ConfigPanelComponent]
})
export class CloudManConfigComponent {}