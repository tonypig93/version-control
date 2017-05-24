import { Component, ViewChild, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { isEmail, password2 } from '../../services/validator';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GroupUserDataService } from '../../group/services/group-data.service';
let encrypt = window['CryptoJS'].MD5;
@Component({
  selector: 'add-user-modal',
  templateUrl: './add-user-modal.html',
  styleUrls: ['./add-user.css']
})
export class AddUserModalComponent implements OnInit {
  @Input() public isModalShown = false;
  @Input() public groupId: number;
  @Output() public modalChange = new EventEmitter();
  @Output() public refreshList = new EventEmitter();
  @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
  public userForm: any;
  public userInfo: any = {
      userName: '',
      email: '',
      groupId: '',
  }
  formErrors = {
    'userName': '',
    'email': '',
    'password': '',
    'password2': ''
  };
  validationMessages = {
    'userName': {
      'required': 'User name is required.',
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email address invalid.'
    },
    'password': {
      'required': 'Password is required.'
    },
    'password2': {
      'required': 'Password is required.',
      'password2': 'Passwords inconformity.'
    }
  };
  constructor(private fb: FormBuilder, private userManage: GroupUserDataService) { }
  ngOnInit(): void {
    this.buildForm();
  }
  public buildForm(): void {
      this.userForm = this.fb.group({
        userName: ['', Validators.required],
        email: ['', [isEmail, Validators.required]],
        password: ['', Validators.required],
        password2: ['', [password2, Validators.required]],
      });
      this.userForm.valueChanges
      .subscribe((data: any) => this.onValueChanged(data));
      this.onValueChanged();
  }
  doSubmit(c: FormControl): void {
      if (this.userForm.valid) {
        let values = this.userForm.value;
        let payload = {
            userName: values.userName,
            password: encrypt(values.password).toString(),
            email: values.email,
            groupId: this.groupId
        };
        this.userManage.addUser(payload)
        .subscribe(data => {
            console.log(data);
            this.refreshList.emit();
        });
      }
  }
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;

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
}
