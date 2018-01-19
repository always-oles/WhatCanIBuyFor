import { Directive, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[HidePreviewOnClick]'
})
export class HidePreviewOnClickDirective {
  constructor(private renderer: Renderer2) {}

  @HostListener('click') onClick() {
    // remove fadein class from preview so it could fade out
    this.renderer.removeClass(document.querySelector('.image-preview-container'), 'fadeIn');

    // reset image after fade out animation
    setTimeout(() => {
      this.renderer.removeAttribute(document.querySelector('.image-preview'), 'src');
    }, 700);
  }
}
