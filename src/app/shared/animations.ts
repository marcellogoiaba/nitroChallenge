import { trigger, state, transition, animate, style } from '@angular/animations'

export const smoothCollapse = trigger('smoothCollapse', [
  state('initial', style({
    height: '0',
    overflow: 'hidden',
    opacity: '0',
    visibility: 'hidden'
  })),
  state('final', style({
    overflow: 'visible'
  })),
  transition('initial<=>final', animate('400ms'))
]); 

export const rotate90 = trigger('rotate90', [
  state('initial', style({transform: 'rotate(0)'})),
  state('final', style({transform: 'rotate(90deg)'})),
  transition('initial<=>final', animate('400ms'))
])