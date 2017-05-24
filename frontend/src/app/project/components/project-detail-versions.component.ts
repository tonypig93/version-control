import { Component, Input, Output, EventEmitter, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ParamsService } from '../../group/services/group-data.service';
import { VcDataService } from '../../services/vc-data.service';
import { VcListControl } from '../../services/vc-base.service';
import { ProjectMangementDataService } from '../services/project-data.service';
import 'rxjs/add/operator/debounceTime';

interface IVersion {
    ID?: number,
    major: number,
    minor: number,
    patch: number,
    log: {
        general: string,
        feature: string,
        bug: string
    },
    repoCode: string,
    release?: boolean
}
@Component({
  selector: 'vc-project-detail-versions',
  templateUrl: './project-detail-versions.html',
  styleUrls: ['./project-version.css']
})
export class ProjectDetailVersionsComponent extends VcListControl implements OnInit, AfterViewChecked  {
    @Input() versions: VcDataService;
    form: FormGroup;
    formErrors = {
        'major': '',
        'minor': '',
        'patch': '',
        'repoCode': ''
    };
    validationMessages = {
        'major': {
            'required': 'Majoy number is required.',
        },
        'minor': {
            'required': 'Minor number is required.',
        },
        'patch': {
            'required': 'Patch number is required.'
        },
        'repoCode': {
            'required': 'Repository code is required.',
        }
    };
    public filterGroup = {
        version: {
            list: [{
                name: 'Development',
                type: 0
            }, {
                name: 'Production',
                type: 1
            }],
            current: 0,
            searchText: new FormControl()
        }
    };
    selectedVersion = 'New Version';
    selectedV: any = null;
    isReadOnly = false;
    constructor(
      private fb: FormBuilder,
      private ProjectMangementDataService: ProjectMangementDataService,
      private ParamsService: ParamsService) {
          super();
      }
    ngOnInit() {
        this.buildForm();
        this.versions.setFilter((item: any) => {
            let __current = this.filterGroup.version.current;
            return (item.TYPE === __current);
        });
        this.filterGroup.version.searchText.valueChanges
        .debounceTime(500)
        .subscribe((search) => {
            this.versions.setSearchFilter((item: any) => {
                return item.PRJ_NAME.indexOf(search) > -1;
            });
            this.versions.setViewData();
        });
    }
    ngAfterViewChecked() {
      $('.ui.checkbox')['checkbox']();
    }
    doSubmit() {
      let payload = {};
      $.fn.extend(payload, this.form.value);
      payload['projectId'] = this.ParamsService.projectId;
      if (!payload['ID']) {
        payload['type'] = this.filterGroup.version.current;
      }
      this.ProjectMangementDataService.updateVersion(payload)
      .subscribe(data => {
          console.log(data)
          if (data) {
              data = data[0];
              let index = this.versions.findByAttr('ID', data.ID, true);
              if (index >= 0) {
                this.versions.data[index] = data;
              } else {
                this.versions.data.push(data);
              }
              this.versions.setViewData();
              this.setModel(data.ID);
          }
      })
    }
    decrease(name: string) {
      let control = this.form.get(name);
      let value = control.value;
      control.patchValue(--value);
    }
    increase(name: string) {
      let control = this.form.get(name);
      let value = control.value;
      control.patchValue(++value);
    }
    buildForm(): void {
        // let last = this.versions.data[this.versions.data.length - 1];
        this.form = this.fb.group({
            ID: [null],
            major: [undefined, Validators.required],
            minor: [undefined, Validators.required],
            patch: [undefined, Validators.required],
            log: this.fb.group({
              general: '',
              feature: '',
              bug: ''
            }),
            repoCode: ['', Validators.required],
            release: [false]
        });
        this.form.valueChanges
        .subscribe((data: any) => this.onValueChanged(data));
        this.onValueChanged();
        this.setModel(null);
    }
    setModel(ID?: number) {
        let data = ID ? this.versions.findByAttr('ID', ID) : null;
        let last = this.versions.data[this.versions.data.length - 1];
        let model: IVersion = {
            ID: null,
            major: 0,
            minor: 0,
            patch: 0,
            log: {
                general: '',
                feature: '',
                bug: ''
            },
            repoCode: ''
        };
        if (last) {
            if (data) {
                model.ID = data.ID;
                model.major = data.V_MAJOR;
                model.minor = data.V_MINOR;
                model.patch = data.V_PATCH;
                model.log = {
                    general: data.LOG_GENERAL,
                    feature: data.LOG_FEATURE,
                    bug: data.LOG_BUG
                };
                model.repoCode = data.REPO_CODE;
            } else {
                model.major = last.V_MAJOR;
                model.minor = last.V_MINOR;
                model.patch = last.V_PATCH;
            }
        }
        this.form.reset(model);
        this.selectedVersion = data ? `${data.V_MAJOR}.${data.V_MINOR}.${data.V_PATCH}` : 'New Version';
        this.isReadOnly = (data && data.STATUS) ? true : false;
        this.selectedV = data ? data : null;
    }
    onValueChanged(data?: any) {
        if (!this.form) { return; }
        const form = this.form;

        for (const field in this.formErrors) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
            }
        }
        }
    }
    isCurrent(id: number) {
        return (this.selectedV === id) || (this.selectedV && this.selectedV.ID === id);
    }
    selectVersionFilter (type: number) {
        let __current = this.filterGroup.version.current;
        if (__current !== type) {
            this.filterGroup.version.current = type;
            this.versions.setViewData();
        }
        this.setModel(null);
    }
}

