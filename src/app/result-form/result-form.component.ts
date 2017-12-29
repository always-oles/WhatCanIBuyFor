import { Component, OnDestroy, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { GlobalAnimationStateService } from '../services/global-animation-state.service';
import { Subscription } from 'rxjs/Subscription';
import { MAIN_FORM_DONE, MAIN_FORM_HIDING } from '../constants';
import { DataService } from '../services/data.service';

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

      state('in', style({
        transform: 'scale(1) rotate(0)',
        opacity: 1
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

  // subscription to global animation state change
  private animationSubscription: Subscription;
  // subscription to products receiving from backend
  private productsSubscription: Subscription;

  // result products from backend
  public items: Array<Object>;

  public fadeIn: Boolean = false;

  constructor(private dataService: DataService,
              private globalAnimationState: GlobalAnimationStateService
  ) {

    // subscribe to global animation state change
    this.animationSubscription = this.globalAnimationState.get().subscribe(animation => {
      console.warn('result form received animation change', animation);

      // if it's time to animate results
      if (animation === MAIN_FORM_DONE) {
        this.resultFormVisible = true;
        this.fadeIn = true;
      }
    });

    this.productsSubscription = this.dataService.getProducts().subscribe(items => {
      console.warn('received products change', items);
      this.items = items;
    });
  }

  // animation done
  fadeDone($event) {
    // if ($event.toState === 'down') {
    //   this.resultFormVisible = false;
    // }
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
    this.animationSubscription.unsubscribe();
  }
}
