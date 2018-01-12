import { Component, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { GlobalAnimationStateService } from '../services/global-animation-state.service';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../services/data.service';
import AnimatableComponent from '../animatable-component.class';
import {
  MAIN_FORM_DONE,
  MAIN_FORM_HIDING,
  TOURNAMENT_IN
} from '../constants';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.sass']
})
export class ResultsComponent extends AnimatableComponent {
  //@Output()
  //public repeatClicked: EventEmitter<String> = new EventEmitter();

  // animation status
  public fadeStatus: string = 'null';

  // show/hide flag
  public resultsVisible: boolean = false;

  // result products array from backend
  public items: Array<Object>;

  public fadeIn: boolean = false;

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
      // if it's time to animate results
      if (animation === MAIN_FORM_DONE) {
        this.resultsVisible = true;
        this.playAnimation('fadeIn', 2000);
      }
    });

    // subscribe to products receiving from backend
    this.dataService.getProducts().subscribe(items => {
      this.items = items;
    });
  }

  onTournamentClick(): void {
    this.globalAnimationState.set(TOURNAMENT_IN);
  }

  // on Repeat button click
  // onRepeatClick(): void {
  //   console.warn('repeat clicked');
  //   this.repeatClicked.emit();

  //   // invoke fade down animation
  //   this.fadeStatus = 'down';
  // }
}
