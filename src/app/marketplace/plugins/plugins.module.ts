import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LayoutModule } from '../../shared/layout.module';
import { UbuntuConfigComponent } from './ubuntu/ubuntu.component.ts'
import { CloudManConfigComponent } from './cloudman/cloudman.component.ts'
import { GVLConfigComponent } from './gvl/gvl.component.ts'
import { DockerConfigComponent } from './docker/docker.component.ts'
import { DockerFileEditorComponent } from './docker/components/docker-file-editor.component.ts'
import { SelectModule } from 'ng2-select';
import { MarkdownModule } from 'angular2-markdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        LayoutModule,
        SelectModule,
        MarkdownModule
    ],
    declarations: [UbuntuConfigComponent, CloudManConfigComponent, GVLConfigComponent,
                   DockerConfigComponent, DockerFileEditorComponent],
    exports: [UbuntuConfigComponent, CloudManConfigComponent, GVLConfigComponent,
              DockerConfigComponent]
})
export class PluginsModule { }
