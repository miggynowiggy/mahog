const cloneDeep = require('lodash/cloneDeep');
import description from './description';

export default {
  namespaced: true,
  state: {
    symbols: {
      increment: "++",
      decrement: "--",
      addAssignOp: "+=",
      subtractAssignOp: "-=",
      multiplyAssignOp: "*=",
      divideAssignOp: "/=",
      moduloAssignOp: "%=",
      notEqualOp: "!=",
      equalToOp: "==",
      greaterThanEqualOp: ">=",
      lessThanEqualOp: "<=",
      assignOnlyOp: "=",
      greaterThanOp: ">",
      lessThanOp: "<",
      terminator: ";",
      comma: ",",
      period: ".",
      colon: ":",
      LParen: "(",
      RParen: ")",
      LSqr: "[",
      RSqr: "]",
      LCurl: "{",
      RCurl: "}",
      notOp: "!",
      andOp: "&&",
      orOp: "||",
      negaSign: '~',
      addOp: "+",
      subtractOp: "-",
      multiplyOp: "*",
      divideOp: "/",
      moduloOp: "%",
      multilineComment: 'multiline_comment'
    },
    keywords: [
      'seed', 'number', 'string', 'boolean', 'stone', 'object',
      'void', 'num', 'str', 'bol', 'if',  'elif', 'else', 'carve',
      'water', 'cycle', 'during', 'skip', 'break', 'return_word', 'trim',
      'size', 'null', 'true', 'false', 'absorb', 'insert', 'uproot',
      'atChar', 'atPos'
    ],
    tokenStream: []
  },
  getters: {
    tokens: state => state.tokenStream
  },
  mutations: {
    CLEAR_STREAM(state) {
      state.tokenStream = [];
    },
    ADD_TO_STREAM(state, payload) {
      state.tokenStream.push(payload);
    }
  },
  actions: {
    CONVERT_TO_SYMBOL({ state, rootGetters, commit }) {
      commit('CLEAR_STREAM');
      const tokenStream = cloneDeep(rootGetters['lexical/lexemes']);
      for (const entry of tokenStream) {
        const symbolEntries = Object.keys(state.symbols);
        entry.description = description[entry.token];
        if (symbolEntries.includes(entry.token)) {
          entry.token = state.symbols[entry.token];
        }
        commit('ADD_TO_STREAM', entry);
      }
    }
  }
}