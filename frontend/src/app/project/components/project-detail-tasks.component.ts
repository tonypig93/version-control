import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ParamsService } from '../../group/services/group-data.service';

@Component({
  selector: 'vc-project-detail-tasks',
  templateUrl: './project-detail-tasks.html',
  styleUrls: ['./project.css']
})
export class ProjectDetailTasksComponent implements OnInit  {
    @Input() tasks: any [];
    @Input() project: any;
    progress: any [];
    ngOnInit() {
        this.calculateProgress();
    }
    calculateProgress() {
        this.progress = [this.project.TASK_DONE, this.project.TASK_TOTAL];
    }
}
