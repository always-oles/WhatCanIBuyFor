import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { GlobalAnimationStateService } from '../services/global-animation-state.service';
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as mojs from 'mo-js';
import { Subscription } from 'rxjs/Subscription';
import AnimatableComponent from '../animatable-component.class';
import {
  MAIN_FORM_DONE,
  MAIN_FORM_HIDING,
  RESULTS_HIDDEN
} from '../constants';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.sass']
})
export class MainFormComponent extends AnimatableComponent{
  public mainForm: FormGroup;
  public componentVisible: boolean = true;

  public animations: any = {
    formShrinks: false,
    bagShaking: false,
    bagFadeOut: false,
    bagFadeIn: false,
    fadeFromLeft: false
  };

  @ViewChild('bag') bag: ElementRef;


  // mystery bag animation helpers
  public burst: any = null;
  public burstsIntervalHolder: any = null;
  public burstsInterval: number = 500;
  public burstsTimeout: number = 1700;
  public burstsDone: number = 0;
  public burstsNeeded: number = 3;

  constructor(private renderer: Renderer2,
              private globalAnimationState: GlobalAnimationStateService,
              private dataService: DataService,
              private formBuilder: FormBuilder
  ) {
    super();

    // upon global animation state change
    this.globalAnimationState.get().subscribe(animation => {

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
        //this.globalAnimationState.set(MAIN_FORM_DONE);
        //this.renderer.removeClass(document.body, 'animated');
        /////////////////

        // play formShrinks animation, then hide the form
        this.playAnimation('formShrinks', 1200, () => {

          // reset the form
          this.mainForm.reset({
            currency: 'UAH'
          });

        }, true);

        // play bag animations chained
        this.playAnimation('bagFadeIn', 2000, () => {
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
            this.globalAnimationState.set(MAIN_FORM_DONE);

            // then fade out
            this.playAnimation('bagFadeOut', 1300, () => {
              this.resetAnimations();
            });
          }, true);
        }, true);

        break;
      }
    });

    // init the reactive form model
    // this.mainForm = this.formBuilder.group({
    //   product: ['Что-нибудь такоееее', Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(70) ])],
    //   price: [ Math.floor(Math.random() * 1000 + 100), Validators.compose([ Validators.required, Validators.min(50) ])],
    //   currency: ['UAH']
    // });

    this.mainForm = this.formBuilder.group({
      product: [null, Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(70) ])],
      price: [null, Validators.compose([ Validators.required, Validators.min(50) ])],
      currency: ['UAH']
    });

    // init dummy object for burst
    this.burst = new mojs.Burst({
      left:     0,
      top:      0,
      radius:   { 0: 500 },
      count:    20,
      children: {
        shape:        'circle',
        radius:       17,
        fill:         [ '#31FFFF', '#FFF531', '#FF6200', '#CB39FF'],
        strokeWidth:  5,
        duration:     1800
      }
    });
  }

  onSubmitClick(e) {
    e.preventDefault();

    // set global animation state
    this.globalAnimationState.set(MAIN_FORM_HIDING);

    // request products from backend
    this.dataService.requestProducts(this.mainForm.value);
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
