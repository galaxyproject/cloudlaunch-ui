import { NgModule } from '@angular/core';

import { StandardLayoutComponent, PageHeader, PageBody } from './layouts/standard-layout.component';

@NgModule({
  declarations: [
    StandardLayoutComponent,
    PageHeader,
    PageBody
  ],
  imports: [
  ],
  exports: [
    StandardLayoutComponent,
    PageHeader,
    PageBody
  ]
})
export class LayoutModule { }
