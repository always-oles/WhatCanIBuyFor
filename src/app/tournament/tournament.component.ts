import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { GlobalStateService } from '../shared/services/global-state.service';
import AnimatableComponent from '../shared/animatable-component.class';
import {
  REFRESH,
  MAIN_FORM_DONE,
  RESULTS_HIDING,
  RESULTS_LOADED,
  RESULTS_HIDDEN
 } from '../shared/constants';

import 'jquery-bracket/dist/jquery.bracket.min.js';

declare var $: any;

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.sass']
})
export class TournamentComponent extends AnimatableComponent implements OnInit {
  public componentVisible: boolean = false;
  public animations: any = {
    fadeIn: false,
    flyIn: false,
    slideDown: false,
    fall: false
  };
  private maxChance: number = 15;
  private items: Array<Object>;

  constructor(
    private el: ElementRef,
    private dataService: DataService,
    private globalState: GlobalStateService,
    private renderer: Renderer2
  ) { super(); }

  /**
   * Generate chances for tournament products and split them by teams
   * @param items Array of objects
   */
  private generateChances(items): Object {
    const teams = [],
          roundOne = [],
          roundTwo = [];

    let firstTeam,
        secondTeam,
        firstTeamChances,
        secondTeamChances,
        previousRandom,
        j = 0;

    for (let i = 0; i < Object.values(items).length; i++) {
      firstTeam = items[i];
      secondTeam = items[i + 1];

      // save items names
      teams.push([firstTeam.title, secondTeam.title]);

      // generate round chances
      firstTeamChances  = this.getPoints(firstTeam);

      // prevent duplicate by sending prev value and demanding a unique new
      secondTeamChances = this.getPoints(secondTeam, firstTeamChances);

      // chances for first round
      roundOne[j] = [ firstTeamChances, secondTeamChances ];

      // generate round two (final battle)
      previousRandom = this.getPoints(firstTeam);
      roundTwo.push([previousRandom, this.getPoints(secondTeam, previousRandom)]);

      j++; i++; // skip 1
    }

    // return complex bracket object
    return {
      teams,
      results: [roundOne, roundTwo]
    };
  }

  /**
   * Get semi-random points for some item in tournament bracket
   * @param item Object
   * @param cantBe Number or undefined - to prevent same points for another item in same bracket
   * @return Number - points
   */
  private getPoints(item, cantBe?: number): number {
    let chance = Math.floor(Math.random() * this.maxChance + 1);

    // if cantBeEqual is set and equals to current chance
    if (cantBe && chance === cantBe) {

      // repeat until we have another chance
      while (chance === cantBe) {
        chance = Math.floor(Math.random() * this.maxChance + 1);
      }
    }

    return chance;
  }

  ngOnInit() {

    // upon products received - build a bracket for them
    this.dataService.getProducts().subscribe(items => {
      this.items = items;
      this.buildBracket();
    });

    // subscribe to global animation state
    this.globalState.get().subscribe(animation => {
      switch (animation) {

        // results form is fully loaded and visible
        case RESULTS_LOADED:
          // make component visible
          this.componentVisible = true;

          if (this.dataService.isMobile()) {
            // fade in through opacity on mobile
            this.playAnimation('fadeIn', 1500, () => {
              this.playAnimation('fall', 1000, null, true);
            });
          } else {
            // fly from the bottom on other devices
            this.playAnimation('flyIn', 1500, () => {
              this.playAnimation('fall', 1000, null, true);
            });
          }
        break;

        // When results are sliding to the right
        case RESULTS_HIDING:

          // fade out animation
          this.playAnimation('slideDown', 1000, () => {

            // reset everything when hidden
            this.componentVisible = false;
            this.resetAnimations();
            this.resetMatchHTML();
          });
        break;

        // if user refreshes data
        case REFRESH:
          this.resetMatchHTML();

          // reset animations
          this.resetAnimations();

          // hide element
          this.componentVisible = false;
        break;
      }
    });
  }

  /**
   * Clear widget from created bracket
   */
  private resetMatchHTML(): void {
    this.renderer.setProperty(this.el.nativeElement.querySelector('.match'), 'innerHTML', '');
  }

  /**
   * Build a tournament bracket for current items
   */
  private buildBracket(): void {
    if (!this.items.length) { return; }

    // generate chances and teams
    const chances = this.generateChances(this.items);

    // window width
    const ww = window.screen.width;

    // calculate the team width
    let teamWidthCalculated = Math.min(ww / 4, 220);

    // extra small devices
    if (ww < 350) {
      teamWidthCalculated = Math.floor(ww / 5);
    }

    // build the actual bracket
    $(this.el.nativeElement).find('.match').bracket({
      init: chances,
      teamWidth: teamWidthCalculated,
      matchMargin: 20,
      roundMargin: 40,
      centerConnectors: true
    });
  }
}
