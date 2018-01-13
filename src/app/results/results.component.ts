import { Component, EventEmitter, Output, trigger, state, style, transition, animate, Renderer2 } from '@angular/core';
import { GlobalAnimationStateService } from '../services/global-animation-state.service';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../services/data.service';
import AnimatableComponent from '../animatable-component.class';
import { Product } from '../interfaces';
import { Meta } from '@angular/platform-browser';
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

  public loading: boolean = false;

  // animation status
  public fadeStatus: string = 'null';

  // show/hide flag
  public resultsVisible: boolean = true;

  // result products array from backend
  public items: Array<Product>;

  public fadeIn: boolean = false;

  // last search product name
  public lastSearch: string = '';

  constructor(private dataService: DataService,
              private globalAnimationState: GlobalAnimationStateService,
              private renderer: Renderer2,
              private meta: Meta
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

      this.updateMeta();
    });
  }

  /**
   * Update meta and og: tags due to results of search
   * because they are used in share widget
   */
  updateMeta(): void {
    if (!this.items.length) { return; }

    let shortestItems, result;

    // sort items by product title length
    shortestItems = this.items.map(item => item.title).sort((a, b) => a.length - b.length);

    // get like 2 shortest results from products array
    if (this.items.length > 2) {
      shortestItems = shortestItems.slice(0, 2);
    }

    result = shortestItems.join('" или "');

    // update meta tag
    this.meta.updateTag({
      name: 'og:title',
      content: 'Я могу купить "' + result + '"' + ' вместо ' + this.lastSearch;
    });
  }

  /**
   * Vote to remove this product from DB
   * @param $event
   * @param item - product that being voted
   */
  remove($event: any, item: Product): void {
    // add kinda removed class to the whole item
    this.renderer.addClass(this.renderer.parentNode($event.target.parentNode), 'removed');

    // send id to backend
    this.dataService.voteForRemoval(item);
  }

  /**
   * On show tournament bracket button click
   */
  onTournamentClick(): void {
    this.globalAnimationState.set(TOURNAMENT_IN);
  }

  /**
   * On refresh button click
   */
  refresh(): void {
    this.loading = true;

    setTimeout(() => this.loading = false, 2000);
  }

  // on Repeat button click
  // onRepeatClick(): void {
  //   console.warn('repeat clicked');
  //   this.repeatClicked.emit();

  //   // invoke fade down animation
  //   this.fadeStatus = 'down';
  // }
}
