import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { GroupUserDataService, ParamsService } from '../../group/services/group-data.service';
import { ProjectUserDataService } from '../services/project-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vc-project',
  templateUrl: './project.main.html',
  styleUrls: ['./project.css']
})
export class ProjectMainComponent implements OnInit  {
  constructor(
    private GroupUserDataService: GroupUserDataService,
    private ParamsService: ParamsService,
    private ProjectUserDataService: ProjectUserDataService,
    private ActivatedRoute: ActivatedRoute) { }
  ngOnInit() {
  }
}

