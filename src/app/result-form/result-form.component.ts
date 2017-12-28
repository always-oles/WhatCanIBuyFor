import { Component, OnDestroy, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { GlobalAnimationStateService } from '../services/global-animation-state.service';
import { Subscription } from 'rxjs/Subscription';

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
export class ResultFormComponent implements OnDestroy {
  @Output()
  public repeatClicked: EventEmitter<String> = new EventEmitter();

  // animation status
  public fadeStatus: String = 'null';

  // show/hide flag
  public resultFormVisible: Boolean = false;

  public demoItems: Array<Object> = [
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

  public subscription: Subscription;
  public animation: any;

  constructor(private globalAnimationState: GlobalAnimationStateService) {
    this.subscription = this.globalAnimationState.getAnimationState().subscribe(animation => {
      this.animation = animation;
      console.warn('message', animation);
    });
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

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
