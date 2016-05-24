import { Component, OnInit } from '@angular/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from '@angular/common';

import { Cloud, InstanceType } from '../models/cloud';
import { CloudService } from '../services/cloud.service';
import { ConfigPanelComponent } from '../layouts/config-panel.component';

@Component({
  selector: 'cloudlaunch-config',
  templateUrl: 'app/components/cloudlaunch.component.html',
  providers: [CloudService],
  directives: [ConfigPanelComponent, FORM_DIRECTIVES]
})

export class CloudLaunchComponent implements OnInit {
    errorMessage: string;
    showAdvanced: boolean = false;

    selectedCloud: Cloud;
    clouds: Cloud[] = [];
    instanceTypes: InstanceType[] = [];
    // clouds: Cloud[] = [
    //     { name: 'cl1', slug: 'c1s' },
    //     { name: 'cl2', slug: 'c2s' },
    // ]

    // launchForm: ControlGroup;
    constructor(private _cloudService: CloudService,
                fb: FormBuilder) {
        // this.launchForm = fb.group({
        //     // 'clouds': this.clouds
        // });
    }

    ngOnInit() {
        this.getClouds();
        this.getInstanceTypes('aws-us-east-1');
    }

    getClouds() {
        this._cloudService.getClouds()
            .subscribe(clouds => this.clouds = clouds,
                       error => this.errorMessage = <any>error,
                       () => console.log('Got clouds: ', this.clouds));
    }

    getInstanceTypes(slug: string) {
        console.log('gIT slug: ' + slug);
        this._cloudService.getInstanceTypes(slug)
            .subscribe(instanceTypes => this.instanceTypes = instanceTypes,
            error => this.errorMessage = <any>error,
            () => console.log('got instance types: ', this.instanceTypes));
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }
}
