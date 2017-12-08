import { Component, Directive } from '@angular/core';

@Component({
    selector: 'clui-standard-layout',
    templateUrl: 'standard-layout.component.html',
    styleUrls: ['standard-layout.component.css'],
})
export class StandardLayoutComponent {
}

// tslint:disable-next-line:directive-selector
@Directive({ selector: 'page-header' })
export class PageHeaderDirective {
    // No behavior
    // The only purpose is to "declare" the tag in Angular2
}

// tslint:disable-next-line:directive-selector
@Directive({ selector: 'page-body' })
export class PageBodyDirective {
    // No behavior
    // The only purpose is to "declare" the tag in Angular2
}
