import { Component, OnInit, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { GlobalAnimationStateService } from '../services/global-animation-state.service';


@Component({
  selector: 'app-result-form',
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.sass'],
  animations: [
    trigger('fade', [
      state('down', style({
        transform: 'translateY(100vh)',
        opacity: 0
       })),
       transition('* => *', animate('800ms ease-out'))
    ])
  ]
})
export class ResultFormComponent {
  @Output()
  repeatClicked: EventEmitter<String> = new EventEmitter();

  // animation status
  fadeStatus: String = 'null';

  // show/hide flag
  resultFormVisible: Boolean = true;

  demoItems: Array<Object> = [
    {
      name: 'Сварочный инвертор Titan BIS 240',
      count: Math.floor(Math.random() * 10 + 1)
    }
    , {
      name: 'Сварочный инвертор Titan BIS 240',
      count: Math.floor(Math.random() * 10 + 1)
    }
    , {
      name: 'Сварочный инвертор Titan BIS 240',
      count: Math.floor(Math.random() * 10 + 1)
    }
    , {
      name: 'Сварочный инвертор Titan BIS 240',
      count: Math.floor(Math.random() * 10 + 1)
    }
    , {
      name: 'Сварочный инвертор Titan BIS 240',
      count: Math.floor(Math.random() * 10 + 1)
    }
    , {
      name: 'Сварочный инвертор Titan BIS 240',
      count: Math.floor(Math.random() * 10 + 1)
    }
  ];

  constructor(private globalAnimationState: GlobalAnimationStateService) {
    console.warn('constructor result form ', globalAnimationState);
  }

  // animation done
  fadeDone($event) {
    if ($event.toState === 'down') {
      this.resultFormVisible = false;
    }
  }

  // on Repeat button click
  onRepeatClick(): void {
    console.warn('repeat clicked');
    this.repeatClicked.emit();

    // invoke fade down animation
    this.fadeStatus = 'down';
  }

}
