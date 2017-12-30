import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
declare var $: any;

@Component({
  selector: 'app-tournament-form',
  templateUrl: './tournament-form.component.html', 
  styleUrls: ['./tournament-form.component.sass']
})
export class TournamentFormComponent implements OnInit {
  public tournamentFormVisible: boolean = false;
  private maxChance: number = 10;
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
    let chance = Math.floor(Math.random() * this.maxChance * ( 1 / item.count ) + 1);

    // if cantBeEqual is set and equals to current chance
    if (cantBe && chance === cantBe) {

      // repeat until we have another chance
      while (chance === cantBe) {
        console.warn('duplicate: ', chance, cantBe);
        chance = Math.floor(Math.random() * this.maxChance * ( 1 / item.count ) + 1);
      }
    }

    return chance;
  }

  constructor(private el: ElementRef, private dataService: DataService) {}

  ngOnInit() {
    // upon products receive - build a bracket for them
    this.dataService.getProducts().subscribe(items => {
      console.warn('tournament received products');
      this.items = items;
    });
  }

  buildBracket(): void {
    // generate tournament bracket on demand 
    if (!this.items.length) { return; }

    $(this.el.nativeElement).find('.match').bracket({
      init: this.generateChances(this.items),
      teamWidth: 280,
      matchMargin: 20,
      roundMargin: 40
    });
  }
}
