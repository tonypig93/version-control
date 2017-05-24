import { NgModule }      from '@angular/core';
import { ModalModule, BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule }  from '@angular/router';
import { DropdownComponent } from './dropdown/dropdown.component';
import { AddUserModalComponent } from './modal/group-add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownBasicComponent } from './dropdown/dropdown-basic.component';
import { InfoModalComponent } from './modal/info-modal.component';

@NgModule({
    imports:      [ ModalModule.forRoot(), BsDropdownModule.forRoot(), TabsModule.forRoot(),
                    CommonModule, RouterModule, FormsModule, ReactiveFormsModule ],
    declarations: [ ModalComponent, NavBarComponent, DropdownComponent, AddUserModalComponent, DropdownBasicComponent, InfoModalComponent ],
    exports: [ ModalComponent, NavBarComponent, DropdownComponent, AddUserModalComponent, DropdownBasicComponent,
                ModalModule, BsDropdownModule, TabsModule, InfoModalComponent ]
})
export class WidgetModule { }
