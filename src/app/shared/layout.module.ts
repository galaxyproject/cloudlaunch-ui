import { NgModule } from '@angular/core';

import { StandardLayoutComponent, PageHeader, PageBody } from './layouts/standard-layout.component';
import { ConfigPanelComponent, PanelHeader, PanelBody } from './layouts/config-panel.component';

@NgModule({
    declarations: [
        StandardLayoutComponent,
        PageHeader,
        PageBody,
        ConfigPanelComponent,
        PanelHeader,
        PanelBody
    ],
    imports: [
    ],
    exports: [
        StandardLayoutComponent,
        PageHeader,
        PageBody,
        ConfigPanelComponent,
        PanelHeader,
        PanelBody
    ]
})
export class LayoutModule { }
