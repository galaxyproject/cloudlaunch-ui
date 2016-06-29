import 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import {provide} from '@angular/core';
import {GOOGLE_MAPS_PROVIDERS, LazyMapsAPILoaderConfig} from 'angular2-google-maps/core';

bootstrap(AppComponent, [
    GOOGLE_MAPS_PROVIDERS,
    provide(LazyMapsAPILoaderConfig, {
        useFactory: () => {
            let config = new LazyMapsAPILoaderConfig();
            config.apiKey = 'AIzaSyAy6XPTnR8gFEGuzyQNE2Qrz-8b7WcvOcA';
            return config;
        }
    })
]);
