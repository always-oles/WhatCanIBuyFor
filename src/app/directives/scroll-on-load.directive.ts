import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
declare var $: any;

@Directive({
  selector: '[ScrollOnLoad]'
})
export class ScrollOnLoadDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  /**
   * Scroll to image element upon load
   */
  @HostListener('load') onLoad() {
    const offset = this.el.nativeElement.offsetTop - this.el.nativeElement.clientHeight / 2;
    $('html, body').animate({ scrollTop: offset }, 1000);
  }
}
