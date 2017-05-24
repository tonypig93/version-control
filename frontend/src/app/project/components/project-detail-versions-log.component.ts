import { Component, ViewChild, Input, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'project-version-log',
  templateUrl: './project-detail-versions-log.html',
  styleUrls: ['./project-version.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectDetailVersionsLogComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() isReadOnly: boolean;
  log: any;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  modules: any = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],                                         // remove formatting button
    ]
    };
  constructor() { }
  ngOnInit() {
      for (let i = 0, item; (item = this.group.controls[i]); i ++) {
          item.valueChanges
          .debounceTime(500);
      }
  }
}
