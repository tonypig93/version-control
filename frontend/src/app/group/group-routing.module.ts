import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupMainComponent } from './components/group.main.component';
import { GroupDataService, GroupMangementDataService, GroupUserDataService } from './services/group-data.service';
import { GroupManagementComponent } from './components/group-management.component';

const routes: Routes = [
    {
        path: '', component: GroupMainComponent, resolve: {
            groupList: GroupDataService
        },
        children: [
            {path: ':id', component: GroupManagementComponent, resolve: {
                management: GroupMangementDataService,
                userList: GroupUserDataService
            }}
        ]
    },
    {
        path: ':id/project', loadChildren: 'app/project/project.module#ProjectModule'
    }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class GroupRoutingModule { }
