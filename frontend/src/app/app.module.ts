import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'
import { AppComponent }  from './app.component';
import { WidgetModule } from './widgets/widget.module';

import { ProfilesModule } from './profiles/profiles.module';

import { VcHttpService } from './services/vc-http.service';
import { HttpModule } from '@angular/http';
import { VcPlatformService, VcAuthService } from './services/vc-platform.service';
import { VcGlobalComponentService } from './services/vc-global-component.service';

@NgModule({
  imports:      [ BrowserModule, AppRoutingModule, ProfilesModule, HttpModule, WidgetModule ],
  declarations: [ AppComponent ],
  providers:    [ VcHttpService, VcPlatformService, VcGlobalComponentService, VcAuthService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
