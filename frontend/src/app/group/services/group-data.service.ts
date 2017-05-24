import { Injectable } from '@angular/core';
import { VcHttpService } from '../../services/vc-http.service';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GroupDataService implements Resolve<any> {
    public masterData: any[];
    constructor(private http: VcHttpService, private router: Router) { }
    public resolve() {
        return this.getList();
    }
    public getList() {
        return this.http.get('group/list')
        .map(res => {
            this.masterData = res.data;
            return this.masterData;
        });
    }
}
@Injectable()
export class GroupUserDataService implements Resolve<any> {
    public userList: any [];
    constructor(private http: VcHttpService, private router: Router) { }
    public resolve(route: ActivatedRouteSnapshot) {
        return this.getList(route.params['id'])
        .map(data => {
            this.userList = data;
            return data;
        });
    }
    public getList(groupId: number) {
        return this.http.get('user/list?groupId=' + groupId)
        .map(res => res.data);
    }
    public addUser(data: any) {
        return this.http.post('user/add', data)
        .map(res => res.data);
    }
    public deleteUser(userId: number) {
        return this.http.post('user/delete', {id: userId})
        .map(res => res.data);
    }
}
@Injectable()
export class GroupMangementDataService implements Resolve<any> {
    constructor(private http: VcHttpService, private router: Router) { }
    public resolve(route: ActivatedRouteSnapshot) {
        return this.http.get('group/manage?id=' + route.params['id'])
        .map(res => res.data);
    }
}
@Injectable()
export class ParamsService {
    private _groupId: number;
    private _projectId: number;
    constructor(private router: Router) { }
    get groupId () {
        if (!this._groupId) {
            this._groupId = Number(this.router.url.split('/')[2]);
        }
        return this._groupId;
    }
    set groupId(value) {
        this._groupId = value;
    }
    get projectId () {
        if (!this._projectId) {
            this._projectId = Number(this.router.url.split('/')[4]);
        }
        return this._projectId;
    }
    set projectId(value) {
        this._projectId = value;
    }
}


