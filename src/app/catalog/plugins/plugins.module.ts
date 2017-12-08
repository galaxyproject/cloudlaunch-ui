import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material';
import { MatRadioModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';

import { LayoutModule } from '../../shared/layout.module';
import { UbuntuConfigComponent } from './ubuntu/ubuntu.component';
import { CloudManConfigComponent } from './cloudman/cloudman.component';
import { GVLConfigComponent } from './gvl/gvl.component';
import { DockerConfigComponent } from './docker/docker.component';
import { DockerFileEditorComponent } from './docker/components/docker-file-editor.component';
import { MarkdownModule } from 'angular2-markdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatCheckboxModule,
        MatTooltipModule,
        LayoutModule,
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
