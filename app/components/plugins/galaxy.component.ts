import { Component, Input } from '@angular/core';
import { Application, ApplicationVersion } from '../../models/application';

@Component({
   selector: 'galaxy-config',
   template: `<div><i>Galaxy Application template: Appliance name: {{ application.name }} </i></div>`,
})
export class GalaxyConfigComponent {
   @Input()
   application: Application;
   
   @Input()
   applicationVersion: ApplicationVersion;

}
