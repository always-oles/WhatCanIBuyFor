import { Component, EventEmitter, Output, trigger, state, style, transition, animate, Renderer2 } from '@angular/core';
import { GlobalAnimationStateService } from '../services/global-animation-state.service';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../services/data.service';
import AnimatableComponent from '../animatable-component.class';
import { Product, SearchQuery } from '../interfaces';
import { Meta } from '@angular/platform-browser';
import {
  MAIN_FORM_DONE,
  MAIN_FORM_HIDING,
  REFRESH,
  RESULTS_FORM_LOADED
} from '../constants';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.sass']
})
export class ResultsComponent extends AnimatableComponent {
  public isLoading: boolean = false;
  public loadingStarted: number = 0;

  // show/hide flag
  public resultsVisible: boolean = false;

  // result products array from backend
  public items: Array<Product>;

  public animations: object = {
    fadeIn: false
  };

  // last search product name
  public lastSearch: SearchQuery;
  public lastSearchProduct: string = '';

  constructor(private dataService: DataService,
              private globalAnimationState: GlobalAnimationStateService,
              private renderer: Renderer2,
              private meta: Meta
  ) {
    super();

    // subscribe to last search query
    this.dataService.getLastSearch().subscribe(lastSearch => {
      this.lastSearch = lastSearch;
      this.lastSearchProduct = lastSearch.product;
    });

    // subscribe to global animation state change
    this.globalAnimationState.get().subscribe(animation => {
      console.log('results form received animation: ', animation);

      // if it's time to animate results
      if (animation === MAIN_FORM_DONE) {
        this.resultsVisible = true;
        //this.playAnimation('fadeIn', 2000);
        this.globalAnimationState.set(RESULTS_FORM_LOADED);
      }

    });

    // subscribe to products receiving from backend
    this.dataService.getProducts().subscribe(items => {
      this.items = items;

      // update meta tags
      this.updateMeta();

      // if user sees a loader
      if (this.isLoading) {

        // if user seen loader more than 1s - hide it
        if ((Date.now() - this.loadingStarted) > 1000) {
          this.afterRefreshHook()
        } else {

          // user has seen loader less than 1s
          // let's add some time show the cute loader
          setTimeout(() => {
            this.afterRefreshHook();
          }, Math.floor(Math.random() * 500 + 500));
        }
      }
    });
  }

  /**
   * Is invoked after refresh is done
   */
  private afterRefreshHook(): void {

    // hide loader, reset loading counter
    this.isLoading = false;
    this.loadingStarted = 0;

    // notify tournaments component that we are ready
    this.globalAnimationState.set(RESULTS_FORM_LOADED);
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
      content: 'Я могу купить "' + result + '" вместо ' + this.lastSearchProduct
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
   * On refresh button click
   */
  refresh(): void {
    // show loader
    this.isLoading = true;
    this.loadingStarted = Date.now();

    // repeat initial request
    this.dataService.sendProductsRequest(this.lastSearch);

    // set global state to refreshing
    this.globalAnimationState.set(REFRESH);
  }

  /**
   * On restart button click
   */
  restart(): void {
    console.log('RESTART!');
    // show loader
    // this.isLoading = true;
    // this.loadingStarted = Date.now();

    // // repeat initial request
    // this.dataService.sendProductsRequest(this.lastSearch);

    // this.globalAnimationState.set(REFRESH);
  }
}
