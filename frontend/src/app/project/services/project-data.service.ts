import { Injectable } from '@angular/core';
import { VcHttpService } from '../../services/vc-http.service';
import { Router, Resolve, Route, ActivatedRouteSnapshot } from '@angular/router';
import { ParamsService } from '../../group/services/group-data.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectDataService implements Resolve<any> {
    public masterData: any[];
    constructor(private http: VcHttpService, private router: Router) { }
    public resolve() {
        return this.getList();
    }
    public getList() {
        return this.http.get('project/list')
        .map(res => {
            this.masterData = res.data;
            return this.masterData
        });
    }
    public addProject(data: any) {
        return this.http.post('project/add', data)
        .map(res => res.data);
    }
}
@Injectable()
export class ProjectUserDataService {
    constructor(private http: VcHttpService, private ParamsService: ParamsService) { }
    getRoleList(): Observable<any> {
        return this.http.get('project/role/list?id=' + this.ParamsService.projectId)
        .map(res => res.data);
    }
}
@Injectable()
export class ProjectMangementDataService implements Resolve<any> {
    public management: any;
    constructor(private http: VcHttpService, private ParamsService: ParamsService) { }
    public resolve(route: ActivatedRouteSnapshot) {
        this.ParamsService.projectId = route.params['id'];
        return this.http.get('project/manage?id=' + route.params['id'])
        .map(res => {
            this.management = res.data;
            return res.data;
        });
    }
    public addUser(data: any) {
        return this.http.post('project/user/add', data)
        .map(res => res.data);
    }
    public deleteUser(userId: number, projectId: number) {
        return this.http.post('project/user/delete', {userId: userId, projectId: projectId})
        .map(res => res.data);
    }
    public updateRole(roleId: number, value: number) {
        return this.http.post('project/role/update', {roleId: roleId, value: value})
        .map(res => res.data);
    }
    public deleteRole(roleId: number, projectId: number) {
        return this.http.post('project/role/delete', {roleId: roleId, projectId: projectId})
        .map(res => res.data);
    }
    public addRole(data: any) {
        return this.http.post('project/role/add', data)
        .map(res => res.data);
    }
    public updateVersion(data: any) {
        return this.http.post('project/version/update', data)
        .map(res => res.data);
    }
}
