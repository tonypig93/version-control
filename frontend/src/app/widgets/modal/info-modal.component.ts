import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { VcGlobalComponentService } from '../../services/vc-global-component.service';

@Component({
  selector: 'info-modal',
  templateUrl: './info-modal.html'
})
export class InfoModalComponent implements OnInit {
  public isModalShown = false;
  public modalTitle = 'Info';
  public modalBody = '';
  @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
  constructor(private VcGlobalComponentService: VcGlobalComponentService) {}
  public showModal(): void {
    this.isModalShown = true;
  }

  public hideModal(): void {
    this.autoShownModal.hide();
  }

  public onHidden(): void {
    this.isModalShown = false;
  }
  public ngOnInit(): void {
    this.VcGlobalComponentService.infoModal = this;
  }
}
