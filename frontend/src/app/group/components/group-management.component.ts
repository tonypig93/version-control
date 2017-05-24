import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VcDataService } from '../../services/vc-data.service';
import { GroupDataService, GroupUserDataService, ParamsService } from '../services/group-data.service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
interface IManagement {
    users: VcDataService,
    projects: VcDataService
}
@Component({
  selector: 'vc-group-management',
  templateUrl: './group.management.html',
  styleUrls: ['./group.css']
})
export class GroupManagementComponent implements OnInit  {
    public management: IManagement;
    public showModal = false;
    public groupId: number;
    public selected: number;
    public filterGroup = {
        project: {
            list: [{
                name: 'All',
                type: 0
            }, {
                name: 'Public',
                type: 1
            }, {
                name: 'Private',
                type: 2
            }],
            current: 0,
            searchText: new FormControl()
        },
        user: {
            list: [{
                name: 'All',
                type: 0
            }],
            current: 0,
            searchText: new FormControl()
        }
    };
    constructor(
        private ActivatedRoute: ActivatedRoute,
        private GroupDataService: GroupDataService,
        private GroupUserDataService: GroupUserDataService,
        private ParamsService: ParamsService) {
    }
    ngOnInit() {
        this.ActivatedRoute.data.subscribe(data => {
            let projectData = data['management'];
            let userList = data['userList'];
            this.management = {
                projects: new VcDataService(projectData['projects']),
                users: new VcDataService(userList)
            };
            this.management.projects.setFilter((item: any) => {
                let __current = this.filterGroup.project.current;
                return (__current === 0) || (item.VISIBILITY === __current);
            });
            this.calculateProgress();
        });
        this.ActivatedRoute.params.subscribe(params => {
            this.groupId = params['id'];
            this.ParamsService.groupId = this.groupId;
        });
        this.filterGroup.project.searchText.valueChanges
        .debounceTime(500)
        .subscribe((search) => {
            this.management.projects.setSearchFilter((item: any) => {
                return item.PRJ_NAME.toLowerCase().indexOf(search.toLowerCase()) > -1;
            });
            this.management.projects.setViewData();
        });
        this.filterGroup.user.searchText.valueChanges
        .debounceTime(500)
        .subscribe((search) => {
            this.management.users.setSearchFilter((item: any) => {
                return item.userName.toLowerCase().indexOf(search.toLowerCase()) > -1;
            });
            this.management.users.setViewData();
        });
    }
    private calculateProgress() {
        if (this.management && this.management.projects) {
            for (let i = 0, item; (item = this.management.projects.data[i]); i++) {
                let done = item.TASK_DONE, total = item.TASK_TOTAL;
                item.progress = [done, total];
            }
        }
    }
    refresh() {
        this.GroupUserDataService.getList(this.groupId)
        .subscribe(data => {
            this.management.users.data = data;
            // this.GroupDataService.getList()
            // .subscribe(() => {});
        });
    }
    mark(id: number) {
        this.selected = id;
    }
    isMarked(id: number) {
        return this.selected === id;
    }
    deleteUser() {
        this.GroupUserDataService.deleteUser(this.selected)
        .subscribe(data => {
            this.refresh();
        });
    }
    trackByID(index: number, item: any) {
        return item.ID;
    }
    selectProjectFilter (type: number) {
        let __current = this.filterGroup.project.current;
        if (__current !== type) {
            this.filterGroup.project.current = type;
            this.management.projects.setViewData();
        }
    }
    selectUserFilter (type: number) {
        let __current = this.filterGroup.user.current;
        if (__current !== type) {
            this.filterGroup.user.current = type;
            this.management.users.setViewData();
        }
    }
}
