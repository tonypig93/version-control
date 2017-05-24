export class VcDataService {
    private _data: any [];
    public viewData: any[];
    private currentSortAttr = 'ID';
    private filters: any [] = [];
    private searchFilter: any;
    constructor(source: any[]) {
        this.data = source;
        this.viewData = source;
    }
    set data(value: any []) {
        this._data = value;
        this.setViewData();
    }
    get data() {
        return this._data;
    }
    public sort(attr: string) {
        this.currentSortAttr = attr;
        this.quickSort(this.data, 0, this.data.length - 1, attr);
    }
    private quickSort(arr: any [], left: number, right: number, attr: string) {
        if (left > right) {
            return;
        }
        let pivot = arr[left],
            i = left,
            j = right;
        while (i !== j) {
            while (arr[j][attr] >= pivot[attr] && i < j) {
                j--;
            }
            while (arr[i][attr] <= pivot[attr] && i < j) {
                i++;
            }
            if (i < j) {
                let tmp = arr[j];
                    arr[j] = arr[i];
                    arr[i] = tmp;
            }
        }
        arr[left] = arr[i];
        arr[i] = pivot;
        this.quickSort(arr, left, i - 1, attr);
        this.quickSort(arr, i + 1, right, attr);
    }
    public findByAttr(attr: string, value: any, isIndex = false) {
        if (!this.data) {
            return null;
        }
        if (this.currentSortAttr && (this.currentSortAttr !== attr)) {
            throw new Error('Current data set is not sorted by \"' +
                attr + '\"! Resort data set with \"' + attr + '\" or  using `findByAttrLinear`');
        }
        let left = 0,
            right = this.data.length - 1;
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if (value > this.data[mid][attr]) {
                left = mid + 1;
            } else if (value < this.data[mid][attr]) {
                right = mid - 1;
            } else {
                return isIndex ? mid : this.data[mid];
            }
        }
        let shot = this.data[left] && (this.data[left][attr] === value);
        return shot ? (isIndex ? left : this.data[left]) : (isIndex ? -(++left) : null);
    }
    public findByAttrLinear(attr: string, value: any) {
        let res = [];
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i][attr] === value) {
                res.push(this.data[i]);
            }
        }
        return res.length > 0 ? (res.length > 1 ? res : res[0]) : null;
    }
    public setFilter(fn: any) {
        this.filters.push(fn);
    }
    public setSearchFilter(fn: any) {
        this.searchFilter = fn;
    }
    public setViewData() {

        let res = [];
        for (let i = 0, item; (item = this.data[i]); i ++) {
            let pass = true;
            for (let j = 0, filter; (filter = this.filters[j]); j ++) {
                if (typeof filter === 'function') {
                    pass = (pass && filter(item));
                }
            }
            if (typeof this.searchFilter === 'function') {
                pass = (pass && this.searchFilter(item));
            }
            if (pass) {
                res.push(item);
            }
        }
        return this.viewData = res;
    }
}
