// Copyright 2015, EMC, Inc.

export default class Trie {

  index = {};

  clear() {
    this.index = {};
  }

  delimit(value, delimiter) {
    return value && value.toLowerCase().split(delimiter || /\s+/) || [];
  }

  insert(words, value, delimiter) {
    this.delimit(words, delimiter).forEach(word => {
      let letters = word.split(''),
          index = this.index;

      letters.forEach(letter => {
        index = index[letter] = index[letter] || {results: []};
        index.results.push(value);
      });
    });
  }

  find(words, delimiter) {
    let results = [];

    this.delimit(words, delimiter).forEach(word => {
      let letters = word.split(''),
          index = this.index;

      letters.forEach(letter => {
        index = index[letter] || index;
      });

      if (index && index.results) {
        index.results.forEach(item => {
          if (results.indexOf(item === -1)) {
            results.push(item);
          }
        });
      }
    });

    return results;
  }

}
