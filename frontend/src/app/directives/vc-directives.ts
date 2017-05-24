import { Directive, ElementRef, HostListener, Pipe } from '@angular/core';
@Directive({
    selector: '[vc-active-list]'
})
export class VcActiveList {
    private current: any;
    constructor(el: ElementRef) {
    }
    @HostListener('click')
    onClick() {
        console.log(333);
    }
}
@Pipe({
  name: 'reverse'
})
export class ReversePipe {
  transform(value: any []) {
    return value.slice().reverse();
  }
}
