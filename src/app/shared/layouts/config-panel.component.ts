import { Component, ViewEncapsulation, Directive } from '@angular/core';

@Component({
    selector: 'clui-config-panel',
    templateUrl: './config-panel.component.html',
    styleUrls: ['./config-panel.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ConfigPanelComponent {
}

// tslint:disable-next-line:directive-selector
@Directive({ selector: 'panel-header' })
export class PanelHeaderDirective {
    // No behavior
    // The only purpose is to "declare" the tag in Angular2
}

// tslint:disable-next-line:directive-selector
@Directive({ selector: 'panel-body' })
export class PanelBodyDirective {
    // No behavior
    // The only purpose is to "declare" the tag in Angular2
}
