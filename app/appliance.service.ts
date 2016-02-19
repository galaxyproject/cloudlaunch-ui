import { Injectable } from 'angular2/core';

import { Appliance } from './appliance';
import { APPS } from './mock-appliance';

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
