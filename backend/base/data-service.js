'use strict';
let DataService = function (data, sortAttr = 'ID') {
    this.data = data;
    this.currentSortAttr = sortAttr;
};
let fn = DataService.prototype;
fn.sort = function sort(attr) {
    if (!this.data) {
        return null;
    }
    this.currentSortAttr = attr;
    quickSort(this.data, 0, this.data.length - 1, attr);
};

function quickSort(arr, left, right, attr) {
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
    quickSort(arr, left, i - 1, attr);
    quickSort(arr, i + 1, right, attr);
}
fn.findByAttr = function (attr, value, isIndex = false) {
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
    let shot = this.data[left] && (this.data[left][attr] === value); // shot or not shot, not shot will return the nearest index.
    return shot ? (isIndex ? left : this.data[left]) : (isIndex ? -(++left) : null); // in case index 0, cannot tell difference between 0 and -0, so add 1 to `left`;
};
fn.findByAttrLinear = function (attr, value) {
    if (!this.data) {
        return null;
    }
    let res = [];
    for (let i = 0; i < this.data.length; i++) {
        if (this.data[i][attr] === value) {
            res.push(this.data[i]);
        }
    }
    return res.length > 0 ? (res.length > 1 ? res : res[0]) : null;
};
fn.deleteByAttr = function (attr, value) {
    if (!this.data || this.data.length === 0) {
        return null;
    }
    let index;
    if (attr === this.currentSortAttr) {
        index = this.findByAttr(attr, value, true);
        if (index !== null) {
            for (let i = index; i < this.data.length - 1; i ++) {
                this.data[i] = this.data[i + 1];
            }
            this.data.length = this.data.length - 1;
        }
    }
    return index;
};
fn.insert = function (item) {
    // this.deleteByAttr(this.currentSortAttr, item[this.currentSortAttr]);
    let nearIndex = this.findByAttr(this.currentSortAttr, item[this.currentSortAttr], true);
    if (nearIndex >= 0) {
        this.data[nearIndex] = item;
        return this.data.length;
    } else {
        nearIndex = -(nearIndex + 1);
    }
    let destIndex = 0;
    if (this.data[nearIndex]) {
        destIndex = this.data[nearIndex][this.currentSortAttr] > item[this.currentSortAttr] ? nearIndex : nearIndex + 1;
    }
    this.data.push(item);
    for (let i = this.data.length - 2; i >= destIndex; i --) {
        // this.data[i + 1] = this.data[i];
        [this.data[i + 1], this.data[i]] = [this.data[i], this.data[i + 1]];
    }
    this.data[destIndex] = item;
    return this.data.length;
};
module.exports = DataService;