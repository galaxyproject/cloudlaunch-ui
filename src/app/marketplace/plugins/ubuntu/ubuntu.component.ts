import { Component, Input } from '@angular/core';
import { BasePluginComponent } from '../base-plugin.component';

    
@Component({
   selector: 'ubuntu-config',
   template: ``,
})
export class UbuntuConfigComponent {

   @Input()
   initialConfig: any;
}
