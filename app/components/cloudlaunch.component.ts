import { Component, OnInit } from 'angular2/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from 'angular2/common';

import { Cloud } from '../models/cloud';
import { CloudService } from '../services/cloud.service';

@Component({
  selector: 'cloudlaunch-config',
  templateUrl: 'app/components/cloudlaunch.component.html',
  providers: [CloudService],
  directives: [FORM_DIRECTIVES]
})

export class CloudLaunchComponent implements OnInit {
    clouds: Cloud[] = [];
    errorMessage: string;
    showAdvanced: boolean = false;

    // launchForm: ControlGroup;
    constructor(private _cloudService: CloudService, fb: FormBuilder) {
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
                       error => this.errorMessage = <any>error);
    }

    toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }
}
