import { Injectable } from 'angular2/core';

import { Appliance } from '../models/appliance';
import { APPS } from '../models/mock-appliance';

@Injectable()
export class ApplianceService {

   getAppliances() {
     return Promise.resolve(APPS);
   }

   getAppliance(id: number) {
      return Promise.resolve(APPS).then(
         apps => apps.filter(app => app.id === id)[0]
      );
   }
}
