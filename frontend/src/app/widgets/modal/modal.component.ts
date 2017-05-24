import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'modal',
  templateUrl: './modal.html'
})
export class ModalComponent {
  @Input() public isModalShown = false;
  @Input() public modalTitle = 'Info';
  @Input() public modalBody = '';
  @Output() public modalChange = new EventEmitter();
  @ViewChild('autoShownModal') public autoShownModal: ModalDirective;

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
