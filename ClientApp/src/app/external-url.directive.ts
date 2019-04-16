import { Directive, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: 'a[appExternalUrl]'
})
export class ExternalUrlDirective {

  constructor(private el: ElementRef, private router: Router) { }

  @HostListener('click', ['$event'])
  clicked(event: Event) {
    const url = this.el.nativeElement.href;
    if (isNil(url)) {
      return;
    }

    this.router.navigate(['/externalRedirect', { externalUrl: url }], {
      skipLocationChange: true,
    });

    event.preventDefault();
  }

  private 

}

function isNil(url: string): boolean {
  return !(url && url.length);
}
