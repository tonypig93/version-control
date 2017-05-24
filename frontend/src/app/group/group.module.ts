import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetModule } from '../widgets/widget.module';
import { GroupRoutingModule } from './group-routing.module';
import { GroupMainComponent } from './components/group.main.component';
import { GroupDataService, GroupMangementDataService, GroupUserDataService, ParamsService } from './services/group-data.service';
import { GroupManagementComponent } from './components/group-management.component';
import { MarkClickedDirective } from './directives/directives';

@NgModule({
    imports:      [ CommonModule, FormsModule, GroupRoutingModule, WidgetModule, ReactiveFormsModule ],
    declarations: [ GroupMainComponent, GroupManagementComponent, MarkClickedDirective ],
    providers: [ GroupDataService, GroupMangementDataService, GroupUserDataService, ParamsService ]
})
export class GroupModule { }
