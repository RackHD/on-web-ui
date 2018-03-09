import { Comparator, StringFilter } from "@clr/angular";
import * as _ from 'lodash';

export class AlphabeticalComparator<T> implements Comparator<T> {
    sortBy: string;
    constructor(sortBy: string) {
        this.sortBy = sortBy;
    }
    compare(a: T, b: T) {
        let sortedArray = _.sortBy([a, b], [o =>
            (JSON.stringify(o[this.sortBy]))]);
        return _.findIndex(sortedArray, a) - _.findIndex(sortedArray, b);
    }
}

// class StringOperator {
//     static contain: boolean = function (src: string, term: string) {
//         if (!src) {
//             return false;
//         }
//         if (!term) {
//             return true;
//         }
//         return src.toLowerCase().includes(term.toLowerCase());
//     }

//     static search: <T> = function (term: string, tableData: T, searchDomain: string[]) {
//         return _.filter(tableData, data => {
//             let flag = false;
//             _.forEach(searchDomain, item => {
//                 if (this.contain(_.toString(data[item]), term)) {
//                     flag = true;
//                     return false;
//                 }
//             })
//             return flag;
//         });
//     }
// }

export class DateComparator implements Comparator<Node> {
    sortBy: string;

    constructor(sortBy: string) {
        this.sortBy = sortBy;
    }

    compare(a: Node, b: Node) {
        return Number(a[this.sortBy]) - Number(b[this.sortBy]);
    }
}

///////////////////////////////////////////////////////////////////
//
// Filter for specific field of a Obj
//
// Usage:  if you want to filter Event by ID, then new ObjectFilterByKey<Event>('ID').
///////////////////////////////////////////////////////////////////
export class ObjectFilterByKey<T> implements StringFilter<T> {
    private _field: string;

    constructor(field: string) {
        this._field = field;
    }

    accepts(obj: T, searchKey: string): boolean {
        if (!obj || !obj[this._field]) {
            return false;
        }
        if (typeof (obj[this._field]) !== 'string') {
            console.warn(`Warn,Only accept string in ObjectFilterByKey for: ${obj.constructor.name}[${this._field}].`);
            return JSON.stringify(obj[this._field]).toLowerCase().indexOf(searchKey) >= 0;
        } else {
            return obj[this._field].toLowerCase().indexOf(searchKey) >= 0;
        }
    }
}