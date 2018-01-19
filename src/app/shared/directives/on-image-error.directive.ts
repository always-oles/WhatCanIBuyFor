import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[OnImageError]'
})
export class OnImageErrorDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('error') onError() {
    this.renderer.addClass(this.el.nativeElement.parentNode, 'error');
    this.renderer.setAttribute(this.el.nativeElement, 'src', '/assets/warning.svg');
  }

}
