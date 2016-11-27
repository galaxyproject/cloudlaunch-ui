import { Component } from '@angular/core';
import { AppSettings } from './app.settings'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    getDeveloperAPILink() : string {
        return AppSettings.CLOUDLAUNCH_API_ENDPOINT; 
    }
    
    getSupportContactLink() : string {
        return AppSettings.CLOUDLAUNCH_SUPPORT_LINK; 
    }
}
