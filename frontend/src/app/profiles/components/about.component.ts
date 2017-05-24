import { Component } from '@angular/core';

@Component({
  selector: 'vc-about',
  template: `<h1>About</h1><a [routerLink]="['/login']">login</a>`,
})
export class AboutComponent  { }