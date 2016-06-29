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
    
    styles =
        [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#444444"}]
        }, {"featureType": "landscape", "elementType": "all", "stylers": [{"color": "#f2f2f2"}]}, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{"saturation": -100}, {"lightness": 45}]
        }, {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{"visibility": "simplified"}]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
        }, {"featureType": "water", "elementType": "all", "stylers": [{"color": "#4f595d"}, {"visibility": "on"}]}];
    
    center_latitude = 18;
    center_longitude = 0;
    zoom = 2;
}