import { Injectable } from '@angular/core';
import { VcHttpService } from './vc-http.service';
import { ProfilesService } from '../profiles/services/profiles.service';
import { Router, CanLoad, Route, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { VcGlobalComponentService } from '../services/vc-global-component.service';

@Injectable()
export class VcPlatformService implements CanLoad {
    constructor(private ProfilesService: ProfilesService, private http: VcHttpService, private router: Router) { }
    public canLoad(): Observable<any> {
        let userInfo = this.ProfilesService.getUserInfo();
        if (!userInfo) {
            return Observable.create((observer: any) => {
                this.router.navigate(['/login']);
                observer.next(false);
                observer.complete();
            });
        }
        return this.http.post('checkIdentity', {})
        .map(res => {
            if (!res.error) {
                return true;
            } else {
                this.ProfilesService.clearUserInfo();
                this.router.navigate(['/login']);
                return false;
            }
        });
    }
}
@Injectable()
export class VcAuthService implements CanActivate {
    constructor(
        private ProfilesService: ProfilesService,
        private http: VcHttpService,
        private router: Router,
        private VcGlobalComponentService: VcGlobalComponentService) { }
    public canActivate(route: ActivatedRouteSnapshot): Observable<any> {
        let userInfo = this.ProfilesService.getUserInfo();
        if (!userInfo) {
            return Observable.create((observer: any) => {
                this.router.navigate(['/login']);
                observer.next(false);
                observer.complete();
            });
        }
        return this.http.post('checkprojectauth', {id: route.params['id']})
        .map(res => {
            if (!res.error) {
                return true;
            } else {
                let modal = this.VcGlobalComponentService.infoModal;
                modal.modalTitle = 'Unauthorized';
                modal.modalBody = res.msg;
                modal.showModal();
                return false;
            }
        });
    }
}
