import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ParamsService } from '../../group/services/group-data.service';
import { VcDataService } from '../../services/vc-data.service';
import { ProjectMangementDataService } from '../services/project-data.service';
import { VcListControl } from '../../services/vc-base.service';

@Component({
  selector: 'vc-project-detail-members',
  templateUrl: './project-detail-members.html',
  styleUrls: ['./project.css']
})
export class ProjectDetailMembersComponent extends VcListControl implements OnInit  {
    @Input() members: VcDataService;
    @Input() roles: VcDataService;
    progress: any [];
    public showModal = false;
    constructor(private ProjectMangementDataService: ProjectMangementDataService, private ParamsService: ParamsService) {
      super();
    }
    ngOnInit() {
    }
    refresh(data: any []) {
      this.members.data = data;
    }
    deleteUser() {
      this.ProjectMangementDataService.deleteUser(this.selected, this.ParamsService.projectId)
      .subscribe(data => {
        if (data) {
          this.members.data = data;
        }
      })
    }
}
