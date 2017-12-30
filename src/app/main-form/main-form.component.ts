import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { GlobalAnimationStateService } from '../services/global-animation-state.service';
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as mojs from 'mo-js';
import { MAIN_FORM_DONE, MAIN_FORM_HIDING } from '../constants';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.sass']
})
export class MainFormComponent {
  // subscribe for animation changes
  private animationSubscription: Subscription;

  // our main form object
  public mainForm: FormGroup;

  // show/hide flag
  public mainFormVisible: Boolean = true;

  // current animation
  public animation: String;

  formAnimated: boolean = false;
  bagAnimated: boolean = false;
  bagFadeOut: boolean = false;

  @ViewChild('bag') bag: ElementRef;

  // mystery bag animation helpers
  burst: any = null;
  burstsIntervalHolder: any = null;
  burstsInterval: number = 500;
  burstsTimeout: number = 1700;
  burstsDone: number = 0;
  burstsNeeded: number = 3;

  constructor(private renderer: Renderer2,
              private globalAnimationState: GlobalAnimationStateService,
              private dataService: DataService,
              private formBuilder: FormBuilder
  ) {
    // upon global animation state change
    this.animationSubscription = this.globalAnimationState.get().subscribe(animation => {
      //console.warn('main form received animation', animation);
      this.animation = animation;
    });

    // init the reactive main form model
    this.mainForm = this.formBuilder.group({
      product: ['Что-нибудь такоееее', Validators.compose([ Validators.required, Validators.minLength(1), Validators.maxLength(70) ])],
      price: [ Math.floor(Math.random() * 1000 + 100) , Validators.required],
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

    this.globalAnimationState.set(MAIN_FORM_HIDING);

    this.dataService.requestProducts(this.mainForm.value);

    this.mainFormVisible = false;

    setTimeout(() => {
      this.globalAnimationState.set(MAIN_FORM_DONE);
    }, 1);

    // reset form
    this.mainForm.reset({
      currency: 'UAH'
    });

    //this.globalAnimationState.setAnimationState('name%of%the%animation');

    // this.formAnimated = true;
    // this.bagAnimated = true;

    // setTimeout(() => this.bagFadeOut = true, 5000);

    // // add class to body
    // this.renderer.addClass(document.body, 'animated');

    // // start bursting after bag animation
    // setTimeout(() => {

    //   // invoke first burst immediately
    //   this.invokeBurst();

    //   // next bursts by interval
    //   this.burstsIntervalHolder = setInterval(() => {
    //     this.invokeBurst();
    //   }, this.burstsInterval);

    // }, this.burstsTimeout);
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
      clearInterval(this.burstsIntervalHolder);
      //this.renderer.removeClass(document.body, 'animated');
    }
  }
}
