import { NgModule } from '@angular/core';

import { StandardLayoutComponent, PageHeaderDirective, PageBodyDirective } from './layouts/standard-layout.component';
import { ConfigPanelComponent, PanelHeaderDirective, PanelBodyDirective } from './layouts/config-panel.component';

@NgModule({
    declarations: [
        StandardLayoutComponent,
        PageHeaderDirective,
        PageBodyDirective,
        ConfigPanelComponent,
        PanelHeaderDirective,
        PanelBodyDirective
    ],
    imports: [
    ],
    exports: [
        StandardLayoutComponent,
        PageHeaderDirective,
        PageBodyDirective,
        ConfigPanelComponent,
        PanelHeaderDirective,
        PanelBodyDirective
    ]
})
export class LayoutModule { }
