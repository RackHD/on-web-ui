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

export class DateComparator implements Comparator<Node> {
    sortBy: string;

    constructor(sortBy: string) {
        this.sortBy = sortBy;
    }

    compare(a: Node, b: Node) {
        return Number(a[this.sortBy]) - Number(b[this.sortBy]);
    }
}

export class ObjectFilterByKey<T> implements StringFilter<T> {
  private _field: string;

  constructor(field: string) {
    this._field = field;
  }

  accepts(obj: T, searchKey: string): boolean {
    let stringValue : string;
    let originValue: any = obj && obj[this._field];
    if (!originValue) {
      return false;
    }
    stringValue = (typeof originValue === "object") ? JSON.stringify(originValue) : originValue.toString();
    return stringValue.toLowerCase().indexOf(searchKey) >= 0;
  }
}

export class StringOperator {
  static contain(src: string, term: string): boolean {
    if (!src) {
      return false;
    }
    if (!term) {
      return true;
    }
    return src.toLowerCase().includes(term.toLowerCase());
  }

  static search<T>(term: string, tableData: Array<T>, searchDomain: string[]): Array<T> {
    return _.filter(tableData, data => {
      let flag = false;
      _.forEach(searchDomain, item => {
        if(this.contain(_.toString(data[item]), term)){
          flag = true;
          return false;
        }
      })
      return flag;
    });
  }
}
