import { Component, Input, Output, EventEmitter, OnInit, AfterViewChecked } from '@angular/core';
import { ParamsService } from '../../group/services/group-data.service';
import { VcDataService } from '../../services/vc-data.service';
import { ProjectMangementDataService } from '../services/project-data.service';
import { VcListControl } from '../../services/vc-base.service';

@Component({
  selector: 'vc-project-detail-roles',
  templateUrl: './project-detail-roles.html',
  styleUrls: ['./project.css']
})
export class ProjectDetailRolesComponent extends VcListControl implements OnInit, AfterViewChecked  {
    @Input() roles: VcDataService;
    @Input() powers: VcDataService;
    public showModal = false;
    constructor(private ProjectMangementDataService: ProjectMangementDataService, private ParamsService: ParamsService) {
      super();
    }
    ngOnInit() {
      for (let i = 0, item; (item = this.roles.data[i]); i ++) {
        item.powerList = this.getPowerList(item.POWER);
      }
    }
    ngAfterViewChecked() {
      $('.ui.checkbox')['checkbox']();
    }
    getPowerList(value: number): any [] {
      let res = [];
      for (let i = 0, item; (item = this.powers.data[i]); i ++) {
        let tmp = {};
        $.extend(tmp, item);
        tmp['checked'] = (item.POWER_VALUE === (value & item.POWER_VALUE));
        res.push(tmp);
      }
      return res;
    }
    updateRole(role: any) {
      let sum = 0;
      for (let i = 0, item; (item = role.powerList[i]); i ++) {
        if (item.checked) {
          sum += item.POWER_VALUE;
        }
      }
      this.ProjectMangementDataService.updateRole(role.ID, sum)
      .subscribe(data => {
      });
    }
    deleteRole(roleId: number) {
      this.ProjectMangementDataService.deleteRole(roleId, this.ParamsService.projectId)
      .subscribe(data => {
        if (data) {
          this.roles.data = data;
          this.ngOnInit();
        }
      })
    }
    refresh(data: any) {
      if (data) {
        this.roles.data = data;
        for (let i = 0, item; (item = this.roles.data[i]); i ++) {
          item.powerList = this.getPowerList(item.POWER);
        }
      }
    }
}
