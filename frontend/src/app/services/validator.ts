import { FormControl } from '@angular/forms';
const EMAIL_REG = new RegExp('[a-z0-9]+@[a-z0-9]+.com');
export function isEmail(c: FormControl) {
    return (EMAIL_REG.test(c.value)) ? null : {
        email: {
            valid: false,
            errorMsg: 'Email address invalid'
        }
    }
}
export function password2(c: FormControl) {
    let v = c.value;
    let e = c.root.get('password');
    if (!e) {
        return null;
    }
    // value not equal
    return (e && v === e.value) ? null : {
        password2: {
            valid: false
        }
    };
}
export function notEmpty(c: FormControl) {
    return (c.value && c.value.length > 0) ? null : {
        notEmpty: {
            valid: false
        }
    };
}
