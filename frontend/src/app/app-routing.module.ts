import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{ VcPlatformService } from './services/vc-platform.service';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'project', loadChildren: 'app/project/project.module#ProjectModule', canLoad: [VcPlatformService] },
  { path: 'group', loadChildren: 'app/group/group.module#GroupModule', canLoad: [VcPlatformService] },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
