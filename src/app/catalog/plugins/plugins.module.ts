import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LayoutModule } from '../../shared/layout.module';
import { UbuntuConfigComponent } from './ubuntu/ubuntu.component';
import { CloudManConfigComponent } from './cloudman/cloudman.component';
import { CloudMan2ConfigComponent } from './cloudman2/cloudman2.component';
import { GVLConfigComponent } from './gvl/gvl.component';
import { DockerConfigComponent } from './docker/docker.component';
import { DockerFileEditorComponent } from './docker/components/docker-file-editor.component';
import { MarkdownModule } from 'ngx-markdown';

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
    declarations: [UbuntuConfigComponent, CloudManConfigComponent, CloudMan2ConfigComponent,
                   GVLConfigComponent, DockerConfigComponent, DockerFileEditorComponent],
    exports: [UbuntuConfigComponent, CloudManConfigComponent, CloudMan2ConfigComponent,
              GVLConfigComponent, DockerConfigComponent],
    entryComponents: [UbuntuConfigComponent, CloudManConfigComponent, CloudMan2ConfigComponent,
                      GVLConfigComponent, DockerConfigComponent]
})
export class PluginsModule { }
