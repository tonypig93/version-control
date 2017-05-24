import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ParamsService } from '../../group/services/group-data.service';

@Component({
  selector: 'vc-project-detail-general',
  templateUrl: './project-detail-general.html',
  styleUrls: ['./project.css']
})
export class ProjectDetailGeneralComponent implements OnInit  {
    @Input() project: any;
    private visibilityMap = ['', 'Public', 'Private'];
    ngOnInit() {
    }
    get visibility(){
        return this.visibilityMap[this.project.VISIBILITY];
    }
}
