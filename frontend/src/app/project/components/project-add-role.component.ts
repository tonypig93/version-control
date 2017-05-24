import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ProjectMangementDataService } from '../services/project-data.service';
import { ParamsService } from '../../group/services/group-data.service';
import { VcDataService } from '../../services/vc-data.service';

@Component({
    selector: 'project-add-role-modal',
    templateUrl: './project-add-role-modal.html'
})
export class ProjectAddRoleModalComponent implements OnInit {
    @Input() public isModalShown = false;
    @Input() public powerList: VcDataService;
    @Output() public modalChange = new EventEmitter();
    @Output() public refreshList = new EventEmitter();
    @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
    public roleInfo: any = {
        roleName: '',
        powerList: []
    }
    constructor(
        private ProjectMangementDataService: ProjectMangementDataService,
        private ParamsService: ParamsService) {
    }
    public showModal(): void {
        this.isModalShown = true;
    }

    public hideModal(): void {
        this.autoShownModal.hide();
    }

    public onHidden(): void {
        this.isModalShown = false;
        this.modalChange.emit();
    }
    public onShown(): void {
        $('.ui.checkbox')['checkbox']();
    }
    ngOnInit() {
        this.roleInfo.powerList = this.powerList.data;
        for (let i = 0, item; (item = this.roleInfo.powerList[i]); i ++) {
            item.checked = false;
        }
    }

    doSubmit() {
        if (this.roleInfo.roleName !== '') {
            let sum = 0;
            for (let i = 0, item; (item = this.roleInfo.powerList[i]); i ++) {
                if (item.checked) {
                    sum += item.POWER_VALUE;
                }
            }
            let payload = {
                roleName: this.roleInfo.roleName,
                value: sum,
                projectId: this.ParamsService.projectId
            };
            this.ProjectMangementDataService.addRole(payload)
            .subscribe(data => {
                this.refreshList.emit(data);
                this.roleInfo.roleName = '';
                for (let i = 0, item; (item = this.roleInfo.powerList[i]); i ++) {
                    item.checked = false;
                }
                this.hideModal();
            });
        }
    }
}
