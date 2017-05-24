import { NgModule }             from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { ProjectMainComponent } from './components/project.main.component';
import { ProjectDataService, ProjectUserDataService, ProjectMangementDataService } from './services/project-data.service';
import { ProjectCreateComponent } from './components/project-create.component';
import { ProjectDetailComponent } from './components/project-detail.component';
import { GroupUserDataService } from '../group/services/group-data.service';
import { VcAuthService } from '../services/vc-platform.service';

const routes: Routes = [
    {
        path: '',
        component: ProjectMainComponent,
        resolve: {
            projectList: ProjectDataService,
            userList: GroupUserDataService
        },
        children: [{
            path: 'create',
            component: ProjectCreateComponent
        }, {
            path: ':id',
            component: ProjectDetailComponent,
            canActivate: [VcAuthService],
            resolve: {
                management: ProjectMangementDataService
            }
        }]
    }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProjectRoutingModule { }
