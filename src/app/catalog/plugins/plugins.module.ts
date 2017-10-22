import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatSlideToggleModule } from '@angular/material'

import { LayoutModule } from '../../shared/layout.module';
import { UbuntuConfigComponent } from './ubuntu/ubuntu.component'
import { CloudManConfigComponent } from './cloudman/cloudman.component'
import { GVLConfigComponent } from './gvl/gvl.component'
import { DockerConfigComponent } from './docker/docker.component'
import { DockerFileEditorComponent } from './docker/components/docker-file-editor.component'
import { SelectModule } from 'ng2-select-compat';
import { MarkdownModule } from 'angular2-markdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        MatSlideToggleModule,
        LayoutModule,
        SelectModule,
        MarkdownModule
    ],
    declarations: [UbuntuConfigComponent, CloudManConfigComponent, GVLConfigComponent,
                   DockerConfigComponent, DockerFileEditorComponent],
    exports: [UbuntuConfigComponent, CloudManConfigComponent, GVLConfigComponent,
              DockerConfigComponent],
    entryComponents: [UbuntuConfigComponent, CloudManConfigComponent, GVLConfigComponent,
                      DockerConfigComponent]
})
export class PluginsModule { }
