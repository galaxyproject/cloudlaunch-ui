import { Component, ViewEncapsulation } from '@angular/core';

@Component({
   selector: 'config-panel',
   templateUrl: 'app/layouts/config-panel.component.html',
   styleUrls: ['app/layouts/config-panel.component.css'],
   encapsulation: ViewEncapsulation.None
})
export class ConfigPanelComponent {
}

@Directive({selector: 'panel-header'})
export class PanelHeader {
  // No behavior
  // The only purpose is to "declare" the tag in Angular2 
}

@Directive({selector: 'panel-body'})
export class PanelBody {
  // No behavior
  // The only purpose is to "declare" the tag in Angular2 
}