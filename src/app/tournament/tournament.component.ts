import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { GlobalAnimationStateService } from '../services/global-animation-state.service';
import AnimatableComponent from '../animatable-component.class';
import { TOURNAMENT_IN, REFRESH } from '../constants';
// import * as jquery from 'jquery/dist/jquery.min.js';
import 'jquery-bracket/dist/jquery.bracket.min.js';

declare var $: any;

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html', 
  styleUrls: ['./tournament.component.sass']
})
export class TournamentComponent extends AnimatableComponent implements OnInit {
  public tournamentVisible: boolean = false;
  public animations: object = {
    fadeIn: false,
    fadeOut: false
  };
  private maxChance: number = 15;
  private items: Array<Object>;

  /**
   * Generate chances for tournament products and split them by teams
   * @param items Array of objects
   */
  private generateChances(items): Object {
    let teams = [],
        firstTeam,
        secondTeam,
        firstTeamChances,
        secondTeamChances,
        previousRandom,
        j = 0,
        roundOne = [],
        roundTwo = [];

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
        console.warn('duplicate: ', chance, cantBe);
        chance = Math.floor(Math.random() * this.maxChance + 1);
      }
    }

    return chance;
  }

  constructor(
    private el: ElementRef,
    private dataService: DataService,
    private globalAnimationState: GlobalAnimationStateService,
    private renderer: Renderer2
  ) { super(); }

  ngOnInit() {
    // upon products receive - build a bracket for them
    this.dataService.getProducts().subscribe(items => {
      this.items = items;
      this.buildBracket();
    });

    // subscribe to global animation state
    this.globalAnimationState.get().subscribe(animation => {

      switch (animation) {

        // user clicked on tournament button
        case TOURNAMENT_IN:

          // user clicked on tournament button while it's visible
          if (this.tournamentVisible === true) { return; }

          // make component visible
          this.tournamentVisible = true;

          // animate fade in
          this.playAnimation('fadeIn', 300, () => {
            // scroll to element
            const offset = $('.brackets-container').get(0).offsetTop + $('.brackets-container').get(0).clientHeight;
            $('html, body').animate({ scrollTop: offset }, 1000);
          });
        break;

        // if user refreshes data
        case REFRESH:

          // clear element from built bracket
          this.renderer.setProperty(this.el.nativeElement.querySelector('.match'), 'innerHTML', '');

          // hide element
          this.tournamentVisible = false;
        break;
      }
    });
  }

  buildBracket(): void {
    if (!this.items.length) { return; }

    const chances = this.generateChances(this.items);

    $(this.el.nativeElement).find('.match').bracket({
      init: chances,
      teamWidth: 220,
      matchMargin: 20,
      roundMargin: 40,
      centerConnectors: true
    });
  }
}
