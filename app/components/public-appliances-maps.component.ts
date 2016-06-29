import {Component} from '@angular/core';
import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {PublicService} from '../models/public_service';

@Component({
    moduleId: module.id,
    selector: 'public-appliances-maps',
    templateUrl: 'public-appliances-maps.component.html',
    styleUrls: ['public-appliances-maps.component.css'],
    directives: [GOOGLE_MAPS_DIRECTIVES],
    inputs: ['public_services']
})
export class PublicAppliancesMaps {
    public_services: PublicService[] = [];
    
    center_latitude = 18;
    center_longitude = 0;
    zoom = 2;
}