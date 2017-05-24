import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProfilesService } from './profiles.service';
@Injectable()
export class CheckLoginGuard implements CanActivate {
    constructor(private ProfilesService: ProfilesService, private router: Router) {}
    canActivate(): boolean {
        let userInfo = this.ProfilesService.getUserInfo();
        if (!userInfo || userInfo.expireTime < (new Date()).getTime()) {
            return true;
        } else {
            this.router.navigate(['/group']);
            return false;
        }
    }
}
