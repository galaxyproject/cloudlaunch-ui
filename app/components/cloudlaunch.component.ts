import { Component, OnInit } from 'angular2/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from 'angular2/common';

import { Cloud } from '../models/cloud';
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
    }

    getClouds() {
        this._cloudService.getClouds()
            .subscribe(clouds => this.clouds = clouds,
                       error => this.errorMessage = <any>error,
                       () => console.log('done: ', this.clouds));
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }
}
