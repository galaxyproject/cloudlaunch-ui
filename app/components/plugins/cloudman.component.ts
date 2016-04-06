import { Component, View, DynamicComponentLoader, ElementRef } from 'angular2/core';
import { ConfigPanelComponent } from '../../layouts/config-panel.component';

@Component({
   selector: 'cloudman-config',
   templateUrl: 'app/components/plugins/cloudman.component.html',
   inputs: ['application'],
   directives: [ConfigPanelComponent]
})
export class CloudManConfigComponent {
   cluster: Object = {};
   clusterTypes: Object[] = [  // First element in the list if the default choice
      {'value': 'Data', 'title': 'SLURM cluster only'},
      {'value': 'Galaxy', 'title': 'SLURM cluster with Galaxy'},
      {'value': 'None', 'title': 'Do not set cluster type now'}]
   storageType: string = "";
   showAdvanced: boolean = false;

   onSubmit() {
      console.log(this.cluster);
   }

   setStorage(sType) {
      this.storageType = sType;
      console.log(this.storageType);
   }

   toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
   }

   // launch() {
   //    console.log("CMConfigComponent launch method");
   // }
}
