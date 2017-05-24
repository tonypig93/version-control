import { Component, Input } from '@angular/core';
interface IListFn {
    name: string,
    fn: () => {},
    params?: any []
}
@Component({
  selector: 'dropdown-basic',
  templateUrl: './dropdown-basic.html',
  styleUrls: ['./dropdown-basic.css']
})
export class DropdownBasicComponent {
    @Input() title = '';
    @Input() actions: IListFn [];
    execute(item: IListFn) {
        item.fn.apply(null, item.params);
    }
 }
