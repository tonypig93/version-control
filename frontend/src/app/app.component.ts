import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VcHttpService } from './services/vc-http.service';
import { ProfilesService } from './profiles/services/profiles.service';
import { VcGlobalComponentService } from './services/vc-global-component.service';

@Component({
  selector: 'vc-app',
  templateUrl: './app.html',
})
export class AppComponent implements OnInit  {
  thisYear: number;
  constructor(
    private router: Router,
    private ProfilesService: ProfilesService,
    private http: VcHttpService,
    private VcGlobalComponentService: VcGlobalComponentService) {
    let userInfo = this.ProfilesService.getUserInfo();
    if (userInfo) {
      this.http.setAuthHeader(userInfo.$hash);
    }
  }
  public isLoginPage() {
    return (this.router.url !== '/login') && (this.router.url !== '/');
  }
  ngOnInit() {
    this.thisYear = (new Date()).getFullYear();
  }
  showContact() {
    let modal = this.VcGlobalComponentService.infoModal;
    modal.modalTitle = 'Contact';
    modal.modalBody = 'Email: tony98370@qq.com';
    modal.showModal();
  }
  showAbout() {
    let modal = this.VcGlobalComponentService.infoModal;
    modal.modalTitle = 'About';
    modal.modalBody = 'Version Control is a rough personal website, which is still in developing (it just get started). It provides a simple control system for software versions, and more features will be added into VC to make it more powerful as long as I got continuous ideas. If you want to join me and commit your codes, feel free to contact me(Tony, aka Hayden).';
    modal.showModal();
  }
 }
