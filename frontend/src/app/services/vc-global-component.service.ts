import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InfoModalComponent } from '../widgets/modal/info-modal.component';
@Injectable()
export class VcGlobalComponentService {
    public infoModal: InfoModalComponent;
}
