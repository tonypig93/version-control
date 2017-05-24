import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { VcGlobalComponentService } from '../services/vc-global-component.service';


@Injectable()
export class VcHttpService {
    private headers = new Headers({'Content-Type': 'application/json', 'Authorization': ''});
    public options = new RequestOptions({headers: this.headers});
    private baseUrl = 'http://192.168.3.183:8000/';
    constructor(private http: Http, private VcGlobalComponentService: VcGlobalComponentService) {}
    get(url: string) {
        return this.http.get(this.baseUrl + url, this.options)
        .map(res => res.json());
    }
    post(url: string, body: any = {}) {
        let modal = this.VcGlobalComponentService.infoModal;
        return this.http.post(this.baseUrl + url, body, this.options)
        .map(res => {
            let ret = res.json();
            if (modal && ret.error) {
                modal.modalBody = ret.msg;
                modal.modalTitle = 'Error !';
                modal.showModal();
            }
            return ret;
        })
        .catch((error: any) => {
            if (modal) {
                modal.modalBody = `${error.status}: ${error.statusText}`;
                modal.modalTitle = 'Error !';
                modal.showModal();
            }
            return Observable.throw(error);
        });
    }
    setAuthHeader(token: string) {
        this.options.headers.set('Authorization', token);
    }
}
