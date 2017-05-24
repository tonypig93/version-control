import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ProjectUserDataService, ProjectMangementDataService } from '../services/project-data.service';
import { ParamsService } from '../../group/services/group-data.service';
import { VcDataService } from '../../services/vc-data.service';
import { GroupUserDataService } from '../../group/services/group-data.service';

@Component({
    selector: 'project-add-user-modal',
    templateUrl: './project-add-user-modal.html'
})
export class ProjectAddUserModalComponent implements OnInit {
    @Input() public isModalShown = false;
    @Input() public modalTitle = 'Add a user to this project';
    @Input() public members: VcDataService;
    @Input() public roles: VcDataService;
    @Output() public modalChange = new EventEmitter();
    @Output() public refreshList = new EventEmitter();
    @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
    public userList: any [] = [];
    public roleList: any [] = [];
    public addForm: FormGroup;
    private value: any;
    formErrors = {
        'role': '',
        'user': ''
    };
    validationMessages = {
        'role': {
            'required': 'A Role name is required.',
        },
        'user': {
            'required': 'A user is required.'
        }
    };
    constructor(
        private ProjectUserDataService: ProjectUserDataService,
        private fb: FormBuilder,
        private ProjectMangementDataService: ProjectMangementDataService,
        private ParamsService: ParamsService,
        private GroupUserDataService: GroupUserDataService) { }
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
    refreshValue(value: any): void {
        this.value = value;
    }
    ngOnInit() {
        this.buildForm();
        for (let i = 0, item; (item = this.GroupUserDataService.userList[i]); i ++) {
            if (!this.members.findByAttr('ID', item.ID)) {
                this.userList.push({
                    id: item.ID,
                    text: item.userName
                });
            }
        }
        for (let i = 0, item; (item = this.roles.data[i]); i ++) {
            this.roleList.push({
                id: item.ID,
                text: item.ROLE_NAME
            });
        }
        this.addForm.valueChanges
        .subscribe((data: any) => this.onValueChanged(false));
        this.onValueChanged(false);
    }
    buildForm(): void {
        this.addForm = this.fb.group({
            role: [undefined, Validators.required],
            user: [undefined, Validators.required]
        });
    }
    selected(value: any, control: string) {
        this.addForm.get(control).setValue(value.id);
    }
    removed(value: any, control: string): void {
        this.addForm.get(control).setValue(undefined);
    }
    doSubmit() {
        if (this.addForm.valid) {
            let values = this.addForm.value;
            let payload = values;
            payload.projectId = this.ParamsService.projectId;
            this.ProjectMangementDataService.addUser(payload)
            .subscribe(data => {
                this.refreshList.emit(data);
            });
        } else {
            this.onValueChanged(true);
        }
    }
    onValueChanged(submit: boolean) {
        if (!this.addForm) { return; }
        const form = this.addForm;
        for (const field in this.formErrors) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && (control.dirty || submit) && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
                this.formErrors[field] += messages[key] + ' ';
            }
        }
        }
    }
}
