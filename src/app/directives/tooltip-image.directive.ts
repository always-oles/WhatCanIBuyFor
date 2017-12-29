import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[TooltipImage]'
})
export class TooltipImageDirective implements OnDestroy{
  @Input() TooltipImage: String;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event) {
    console.warn(this.TooltipImage);
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event) {
    console.warn('leave');
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event) {
    console.warn('moving over');
  }

  ngOnDestroy() {
    // remove from page
  }
}
