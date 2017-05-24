import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
    selector: '[markClicked]'
})
export class MarkClickedDirective {
    private currentId: number;
    constructor(public element: ElementRef) {}
    @HostListener('click') onClick() {
        console.log(arguments);
    }
}
