import { Component, Input } from '@angular/core';

@Component({
   selector: 'galaxy-config',
   template: `<div><i>Galaxy Application template: Appliance name: {{ application.name }} </i></div>`,
})
export class GalaxyConfigComponent {

   @Input()
   initialConfig: any;

}
