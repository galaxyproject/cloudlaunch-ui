import { trigger, animate, style, group, query, transition } from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('* => void', [
    style({ opacity: 0 }),
    animate('0.1s')
  ]),
  transition('void => *', [
    style({ opacity: 1 }),
    animate('0.1s')
  ])
]);
