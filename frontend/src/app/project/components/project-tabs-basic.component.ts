import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'project-tabs-basic',
  templateUrl: './project-tabs-basic.html',
  styleUrls: ['./tabs.css']
})
export class ProjectTabsBasicComponent implements OnInit {
  @Input() management: any;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  public currentTab = 'general';
  constructor() { }
  ngOnInit() {
      // console.log(this.management)
  }
  public alertMe(): void {
    setTimeout(function (): void {
      alert('You\'ve selected the alert tab!');
    });
  }

  selectTab(tab_id: number) {
      this.staticTabs.tabs[tab_id].active = true;
  }

  disableEnable() {
    this.staticTabs.tabs[2].disabled = ! this.staticTabs.tabs[2].disabled
  }
}
