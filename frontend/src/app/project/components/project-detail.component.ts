import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { ParamsService } from '../../group/services/group-data.service';
import { ProjectUserDataService, ProjectMangementDataService } from '../services/project-data.service';
import { ActivatedRoute } from '@angular/router';
import { VcDataService } from '../../services/vc-data.service';

@Component({
  selector: 'vc-project-detail',
  templateUrl: './project-detail.html',
  styleUrls: ['./project.css']
})
export class ProjectDetailComponent implements OnInit, AfterViewInit  {
      public management: any;
      public userList: any [];

      constructor(
      private ParamsService: ParamsService,
      private ProjectUserDataService: ProjectUserDataService,
      private ActivatedRoute: ActivatedRoute,
      private ProjectMangementDataService: ProjectMangementDataService) { }
      ngOnInit() {
        let data = this.ProjectMangementDataService.management;
        this.management = {
            project: data['project'],
            members: new VcDataService(data['members']),
            tasks: new VcDataService(data['tasks']),
            versions: new VcDataService(data['versions']),
            roles: new VcDataService(data['roles']),
            powers: new VcDataService(data['powers'])
        };
        // this.ProjectUserDataService.userList.subscribe(_data => {
        //       this.userList = _data;
        // });
      }
      ngAfterViewInit() {
        let icons = ['fa-book', 'fa-folder-open', 'fa-tasks', 'fa-address-book', 'fa-suitcase'];
        $('#project ul.nav:first > li.nav-item').each(function(index) {
          $(this).find('a.nav-link > span').prepend('<i class="fa ' + icons[index] + ' mr5"></i>');
        });
      }
}

