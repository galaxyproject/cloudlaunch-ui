import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

interface App {
  id: number;
  name: string;
  description: string;
  logo: string;
}

@Component({
   selector: 'marketplace',
   templateUrl: 'app/marketplace.component.html',
   styleUrls: ['app/marketplace.component.css'],
})
export class MarketplaceComponent implements OnInit {
   public apps = APPS;

   constructor(
      private _router: Router) {
   }

   ngOnInit() {
   }

   gotoDetail(app: App) {
   }

}

var APPS: App[] = [
  { "id": 1,
    "name": "Galaxy" ,
    "description": "A preconfigured Galaxy instance.",
    "logo": "http://lorempixel.com/56/56/sports/1"
  },
  { "id": 2,
    "name": "GVL",
    "description": "A versatile genomics workbench.",
    "logo": "http://lorempixel.com/56/56/sports/2"
  },
  { "id": 3,
    "name": "CloudMan cluster",
    "description": "A scalable Slurm cluster in the cloud.",
    "logo": "http://lorempixel.com/56/56/sports/3" },
];
