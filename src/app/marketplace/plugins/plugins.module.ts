import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LayoutModule } from '../../shared/layout.module';
import { CloudManConfigComponent } from './cloudman/cloudman.component.ts'
import { SelectModule } from 'ng2-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    LayoutModule,
    SelectModule
  ],
  declarations: [CloudManConfigComponent],
  exports: [CloudManConfigComponent]
})
export class PluginsModule { }
