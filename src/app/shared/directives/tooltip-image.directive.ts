import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[TooltipImage]'
})
export class TooltipImageDirective {
  @Input() TooltipImage: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('click', ['$event']) onClick(event) {
    this.renderer.addClass(document.querySelector('.image-preview-container'), 'fadeIn');
    this.renderer.setAttribute(document.querySelector('.image-preview'), 'src', this.TooltipImage);
  }
}
