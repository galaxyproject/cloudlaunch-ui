import { Component, View, DynamicComponentLoader, ElementRef } from 'angular2/core';
import { ConfigPanelComponent } from '../../layouts/config-panel.component';
import { CloudManConfigComponent } from './cloudman.component';

@Component({
   selector: 'gvl-config',
   templateUrl: 'app/components/plugins/gvl.component.html',
   inputs: ['application'],
   directives: [ConfigPanelComponent, CloudManConfigComponent]
})
export class GVLConfigComponent {}