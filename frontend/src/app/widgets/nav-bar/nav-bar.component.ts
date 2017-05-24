import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ProfilesService, IUserInfo } from '../../profiles/services/profiles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css']
})
export class NavBarComponent {
    public userInfo: IUserInfo;
    public actions: any [];
    constructor(private ProfilesService: ProfilesService, private router: Router) {
        this.userInfo = this.ProfilesService.getUserInfo();
        this.actions = [
            {
                name: 'Settings',
                fn: () => {
                    console.log('settings');
                }
            },
            {
                name: 'Logout',
                fn: () => {
                    this.ProfilesService.logout()
                    .subscribe(data => {
                        if (data) {
                            this.ProfilesService.clearUserInfo();
                            this.router.navigate(['/login']);
                        }
                    })
                }
            }
        ]
    }
}
