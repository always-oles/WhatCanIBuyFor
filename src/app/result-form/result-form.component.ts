import { Component, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { GlobalAnimationStateService } from '../services/global-animation-state.service';
import { Subscription } from 'rxjs/Subscription';
import { MAIN_FORM_DONE, MAIN_FORM_HIDING } from '../constants';
import { DataService } from '../services/data.service';
import AnimatableComponent from '../animatable-component.class';

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
export class ResultFormComponent extends AnimatableComponent {
  @Output()
  public repeatClicked: EventEmitter<String> = new EventEmitter();

  // animation status
  public fadeStatus: String = 'null';

  // show/hide flag
  public resultFormVisible: Boolean = false;

  // result products from backend
  public items: Array<Object>;

  public fadeIn: Boolean = false;

  // last search product name
  public lastSearch: string = '';

  constructor(private dataService: DataService,
              private globalAnimationState: GlobalAnimationStateService
  ) {
    super();

    // subscribe to last search query
    this.dataService.getLastSearch().subscribe(lastSearch => this.lastSearch = lastSearch);

    // subscribe to global animation state change
    this.globalAnimationState.get().subscribe(animation => {
      console.warn('result form received animation change', animation);

      // if it's time to animate results
      if (animation === MAIN_FORM_DONE) {
        this.resultFormVisible = true;
        this.playAnimation('fadeIn', 2000);
      }
    });

    this.dataService.getProducts().subscribe(items => {
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
}
