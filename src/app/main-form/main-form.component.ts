import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { GlobalStateService } from '../shared/services/global-state.service';
import { DataService } from '../shared/services/data.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as mojs from 'mo-js';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import AnimatableComponent from '../shared/animatable-component.class';
import {
  MAIN_FORM_DONE,
  MAIN_FORM_HIDING,
  RESULTS_HIDDEN
} from '../shared/constants';

import * as superplaceholder from 'superplaceholder/dist/superplaceholder.min';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.sass']
})
export class MainFormComponent extends AnimatableComponent implements OnInit, AfterViewInit {
  public mainForm: FormGroup;
  public componentVisible: boolean = true;
  public bagVisible: boolean = false;

  // all available component animations
  public animations: any = {
    formShrinks: false,
    bagShaking: false,
    bagFadeOut: false,
    bagFadeIn: false,
    bagFadeInMobile: false,
    fadeFromLeft: false
  };

  @ViewChild('bag') bag: ElementRef;
  @ViewChild('product') product: ElementRef;

  // mystery bag animation helpers
  public burst: any = null;
  public burstsIntervalHolder: any = null;
  public burstsInterval: number = 500;
  public burstsTimeout: number = 1700;
  public burstsDone: number = 0;
  public burstsNeeded: number = 3;

  // default bag fade in animation
  public bagFadeAnimation: string = 'bagFadeIn';

  constructor(private renderer: Renderer2,
              private globalState: GlobalStateService,
              private dataService: DataService,
              private formBuilder: FormBuilder
  ) {
    super();

    // fade in differently on mobile
    if (this.dataService.isMobile()) {
      this.bagFadeAnimation = 'bagFadeInMobile';
    }

    // upon global animation state change
    this.globalState.get().subscribe(animation => {

      switch (animation) {

        // when result component is completely hidden
        // lets fade from left
        case RESULTS_HIDDEN:
          this.componentVisible = true;
          this.playAnimation('slideFromLeft', 1000);
        break;

        case MAIN_FORM_HIDING:
          // prevent scrollbar flickering
          this.renderer.addClass(document.body, 'animated');

        // debuggin
        //this.componentVisible = false;
        //this.globalState.set(MAIN_FORM_DONE);
        //this.renderer.removeClass(document.body, 'animated');
        /////////////////

        // show the bag
        this.bagVisible = true;

        // scroll to top on mobile
        this.resetScrollOnMobile();

        // play formShrinks animation, then hide the form
        this.playAnimation('formShrinks', 1200, () => {

          // reset the form
          this.mainForm.reset();
        }, true);

        // play bag animations chained
        this.playAnimation(this.bagFadeAnimation, 2000, () => {
          console.log(this.bagFadeAnimation);

          // hide the form
          this.componentVisible = false;

          // invoke first particles burst
          this.invokeBurst();

          // next bursts by interval
          this.burstsIntervalHolder = setInterval(() => {
            this.invokeBurst();
          }, this.burstsInterval);

          // start shaking bag
          this.playAnimation('bagShaking', 1700, () => {

            // notify result form
            this.globalState.set(MAIN_FORM_DONE);

            // then fade out
            this.playAnimation('bagFadeOut', 1300, () => {
              this.resetAnimations();
              this.bagVisible = false;
            });
          }, true);
        }, true);

        break;
      }
    });

    // this.mainForm = this.formBuilder.group({
    //   product: ['Что-нибудь', Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(70) ])],
    //   price: [ Math.floor(Math.random() * 1000 + 100), Validators.compose([ Validators.required, Validators.min(50) ])]
    // });

    // init the reactive form model
    this.mainForm = this.formBuilder.group({
      product: [null, Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(70) ])],
      price: [null, Validators.compose([ Validators.required, Validators.min(50) ])],
    });


    // get radius for bursts
    const circleRadius = this.getCircleRadius();

    // init dummy object for burst
    this.burst = new mojs.Burst({
      left:     0,
      top:      0,
      radius:   { 0: 450 },
      count:    20,
      children: {
        shape:        'circle',
        radius:       circleRadius,
        fill:         [ '#31FFFF', '#FFF531', '#FF6200', '#CB39FF'],
        strokeWidth:  5,
        duration:     1800
      }
    });
  }

  ngAfterViewInit() {
    this.resetScrollOnMobile();
  }

  ngOnInit() {
    // get suggestions for product input
    this.dataService.getSuggestions()

      // remap them to titles array
      .map(suggestions => suggestions.map(item => item.title))
      .subscribe(suggestions => {

        // initiate suggestions in input placeholder
        // thanks https://github.com/chinchang/superplaceholder.js
        superplaceholder({
          el: this.product.nativeElement,
          sentences: suggestions,
          options: {
            letterDelay: 70,
            sentenceDelay: 1000,
            startOnFocus: false,
            loop: true,
            shuffle: true,
            showCursor: true,
            cursor: '|'
          }
        });
      });
  }

  onSubmitClick(e) {
    e.preventDefault();

    // set global state
    this.globalState.set(MAIN_FORM_HIDING);

    // request products from backend
    this.dataService.requestProducts(this.mainForm.value);
  }

  /**
   * In few cases we have to scroll to top on mobile devices
   */
  private resetScrollOnMobile() {
    if (this.dataService.isMobile()) {
      window.scrollTo(0, 0);
    }
  }

  /**
   * Get circle radius for particles during explosions
   */
  private getCircleRadius(): number {
    // for super small screens
    if (window.screen.width < 500) {
      return Math.round(window.screen.width / 40);
    } else {
      return 17; // magical number
    }
  }

  /**
   * Create a burst behind the middle of the bag
   */
  private invokeBurst(): void {
    if (++this.burstsDone <= this.burstsNeeded) {
      this.burst
        .tune({
          x: this.bag.nativeElement.offsetLeft + (this.bag.nativeElement.width / 2),
          y: this.bag.nativeElement.offsetTop + (this.bag.nativeElement.height * 0.6) })
        .setSpeed(3)
        .replay();
    } else {
      // clear interval
      clearInterval(this.burstsIntervalHolder);

      // remove helper class from body
      this.renderer.removeClass(document.body, 'animated');

      // reset variable
      this.burstsDone = 0;
    }
  }
}
