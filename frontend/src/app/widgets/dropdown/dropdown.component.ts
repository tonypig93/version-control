import { Component, Input } from '@angular/core';
interface IListFn {
    name: string,
    fn: () => {}
}
@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.html',
  styleUrls: ['./dropdown.css']
})
export class DropdownComponent {
    @Input() title = '';
    @Input() btnClass = '';
    @Input() actions: IListFn [];
 }
