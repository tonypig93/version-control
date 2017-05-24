import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule }        from '@angular/forms';
import { WidgetModule } from '../widgets/widget.module';
import { ProjectRoutingModule } from './project.routing.module';
import { ProjectMainComponent } from './components/project.main.component';
import { ProjectDataService, ProjectUserDataService, ProjectMangementDataService } from './services/project-data.service';
import { ProjectCreateComponent } from './components/project-create.component';
import { ProjectDetailComponent } from './components/project-detail.component';
import { ProjectTabsBasicComponent } from './components/project-tabs-basic.component';
import { ProjectDetailGeneralComponent } from './components/project-detail-general.component';
import { ProjectDetailTasksComponent } from './components/project-detail-tasks.component';
import { ProjectDetailMembersComponent } from './components/project-detail-members.component';
import { ProjectAddUserModalComponent } from './components/project-add-user.component';
import { ProjectDetailRolesComponent } from './components/project-detail-roles.component';
import { ProjectAddRoleModalComponent } from './components/project-add-role.component';
import { ProjectDetailVersionsComponent } from './components/project-detail-versions.component';
import { ProjectDetailVersionsLogComponent } from './components/project-detail-versions-log.component';
import { VcActiveList, ReversePipe } from '../directives/vc-directives';
import { QuillModule } from 'ngx-quill'
import { SelectModule } from 'ng2-select';

@NgModule({
    imports:      [ CommonModule, FormsModule, ProjectRoutingModule, WidgetModule, ReactiveFormsModule, SelectModule, QuillModule ],
    declarations: [ ProjectMainComponent, ProjectCreateComponent, ProjectDetailComponent, ProjectTabsBasicComponent,
                    ProjectDetailGeneralComponent, ProjectDetailTasksComponent, ProjectDetailMembersComponent,
                    ProjectAddUserModalComponent, ProjectDetailRolesComponent, ProjectAddRoleModalComponent,
                    ProjectDetailVersionsComponent, ProjectDetailVersionsLogComponent, VcActiveList, ReversePipe ],
    providers: [ ProjectDataService, ProjectUserDataService, ProjectMangementDataService ]
})
export class ProjectModule { }
