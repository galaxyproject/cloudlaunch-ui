import { Component, Directive } from '@angular/core';

@Component({
    selector: 'standard-layout',
    templateUrl: 'standard-layout.component.html',
    styleUrls: ['standard-layout.component.css'],
})
export class StandardLayoutComponent {
}

@Directive({ selector: 'page-header' })
export class PageHeader {
    // No behavior
    // The only purpose is to "declare" the tag in Angular2 
}

@Directive({ selector: 'page-body' })
export class PageBody {
    // No behavior
    // The only purpose is to "declare" the tag in Angular2 
}