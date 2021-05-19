const moo = require("moo");

export default {
  namespaced: true,
  state: {
    initialTokenStream: [],
    finalTokenStream: [],
    errors: [],

    // rules to find the keywords and reserved symbol of the language
    rules: {
      id: {
        match: /[_a-zA-Z][a-zA-Z0-9]{0,20}/,
        type: moo.keywords({
          "seed": "seed",
          "number": "number",
          "string": "string",
          "boolean": "boolean",
          "stone": "stone",
          "object": "object",
          "num": "num",
          "str": "str",
          "bol": "bol",
          "if": "if",
          "elif": "elif",
          "else": "else",
          "carve": "carve",
          "water": "water",
          "cycle": "cycle",
          "during": "during",
          "skip": "skip",
          "break": "break",
          "return_word": "return",
          "trim": "trim",
          "size": "size",
          "null": "null",
          "void": "void",
          "true": "true",
          "false": "false",
          "absorb": "absorb",
          "insert": "insert",
          "uproot": "uproot",
          "atChar": "atChar",
          "atPos": "atPos"
        })
      },

      NL: {match: /\n|\r\n|\r/, lineBreaks: true},
      WS: /[ \t]+/,

      negaFloatNumLit: /[~][0-9]{0,9}[\.][0-9]{1,9}/,
      floatNumLit: /[0-9]{0,9}[\.][0-9]{1,9}/,
      negaNumLit: /[~][0-9]{1,9}/,
      numLit: /[0-9]{1,9}/,

      stringLit: [
        // {match: /"""[^]*?"""/, lineBreaks: true, value: x => x.slice(3, -3)},
        // {match: /"(?:\\["\\rn]|[^"\\\n])*?"/, value: x => x.slice(1, -1)},
        // {match: /'(?:\\['\\rn]|[^'\\\n])*?'/, value: x => x.slice(1, -1)}
        {match: /"""[^]*?"""/, lineBreaks: true},
        {match: /"(?:\\["\\rn]|[^"\\\n])*?"/},
        {match: /'(?:\\['\\rn]|[^'\\\n])*?'/}
      ],

      multilineComment: [{
        match: /[@][?][^]*?[?][@]/,
        lineBreaks: true,
        // value: x => x.slice(2, -2)
      }],
      comment: /[@].*/,

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
      quotations: ["'", '"'],
      invalid: /./
    },

    // Delims
    delims: {
      negaSign: [
        'NL', 'WS', 'id', 'LParen', 'negaFloatNumLit', 'floatNumLit',
        'negaNumLit', 'numLit'
      ],
      id: [
        'NL', 'WS', 'comma', 'period', 'colon', 'terminator', 'increment',
        'decrement', 'LSqr', 'LCurl', 'LParen', 'RParen', 'RCurl', 'RSqr',
        'addAssignOp', 'subtractAssignOp', 'multiplyAssignOp', 'divideAssignOp',
        'modoluAssignOp', 'notEqualOp', 'equalToOp', 'greaterThanEqualOp',
        'lessThanEqualOp', 'assignOnlyOp', 'greaterThanOp', 'lessThanOp',
        'andOp', 'orOp', 'addOp', 'subtractOp', 'multiplyOp', 'divideOp',
        'modoluOp', 'notOp'
      ],
      dataTypes: ['NL', 'WS', 'id'],
      keywords: ['NL', 'WS', 'LParen'],
      control: ['terminator'],
      unary: ['NL', 'WS', 'terminator', 'RCurl', 'RSqr', 'RParen'],
      return_word: [
        'NL', 'WS', 'id', 'LParen', 'boolLit', 'stringLit', 'negaFloatNumLit',
        'floatNumLit', 'negaNumLit', 'numLit', 'terminator'
      ],
      else: ['NL', 'WS', 'LCurl'],
      period: [
        'NL', 'WS', 'id', 'absorb', 'insert', 'uproot', 'atChar', 'atPos'
      ],
      notOp: [
        'NL', 'WS', 'id', 'LParen', 'boolLit', 'notOp', 'negaFloatNumLit',
        'floatNumLit', 'negaNumLit', 'numLit', 'stringLit'
      ],
      operators: [
        'NL', 'WS', 'LParen', 'id', 'negaFloatNumLit', 'floatNumLit',
        'negaNumLit', 'numLit', 'boolLit', 'stringLit', 'notOp', 'negaSign'
      ],
      numbers: [
        'NL', 'WS', 'comma', 'period', 'terminator', 'RSqr', 'RCurl', 'RParen',
        'andOp', 'orOp', 'increment', 'decrement', 'notEqualOp', 'equalToOp',
        'greaterThanEqualOp', 'lessThanEqualOp', 'greaterThanOp', 'lessThanOp',
        'addOp', 'subtractOp', 'multiplyOp', 'divideOp', 'moduloOp'
      ],
      boolLit: [
        'NL', 'WS', 'comma', 'terminator', 'RSqr', 'RCurl', 'RParen', 'equalToOp',
        'notEqualOp', 'andOp', 'orOp'
      ],
      stringLit: [
        'NL', 'WS', 'comma', 'period', 'RSqr', 'RCurl', 'RParen',
        'terminator', 'addOp', 'addAssignOp', 'equalToOp', 'notEqualOp',
        'greaterThanEqualOp', 'greaterThan', 'lessThanEqualOp', 'lessThanOp'
      ],
      null: [
        'NL', 'WS', 'RSqr', 'RCurl', 'RParen', 'comma', 'terminator',
        'andOp', 'orOp', 'notEqualOp', 'equalToOp', 'greaterThanOp',
        'greaterThanEqualOp', 'lessThanOp', 'lessThanEqualOp'
      ]
    },

    // keyword and operators grouping
    dataTypes: ['seed', 'number', 'string', 'boolean', 'stone', 'object', 'void'],
    nonNegaNum: ['floatNumLit', 'numLit'],
    negaNum: ['negaFloatLit', 'negaNumLit'],
    numbers: ['negaFloatNumLit', 'floatNumLit', 'negaNumLit', 'numLit'],
    keywords: [
      'num', 'str', 'bol', 'if', 'elif', 'carve', 'water', 'cycle', 'during',
      'trim', 'size', 'absorb', 'insert', 'uproot', 'atChar', 'atPos'
    ],
    operators: [
      'addOp', 'subtractOp', 'multiplyOp', 'divideOp', 'moduloOp', 'andOp', 'orOp',
      'lessThanOp', 'lessThanEqualOp', 'greaterOp', 'greaterThanEqualOp', 'equalToOp',
      'notEqualOp', 'addAssignOp', 'subtractAssignOp', 'multiplyAssignOp', 'dividerAssignOp',
      'moduloAssignOp', 'notEqualOp', 'equalToOp',
    ],
    arithOp: ['addOp', 'subtractOp', 'multiplyOp', 'divideOp', 'moduloOp'],
    relationalOp: ['greaterThanOp', 'lessThanOp', 'greaterThanEqualOp', 'lessThanEqualOp'],
    logicalOp: ['notEqualOp', 'equalToOp'],
    unary: ['increment', 'decrement'],
    unaryOp: ['negaSign', 'notOp'],
    controls: ['skip', 'break'],
    boolLit: ['true', 'false'],
    stoppers: [
      'addOp', 'subtractOp', 'multiplyOp', 'divideOp', 'moduloOp', 'andOp', 'orOp',
      'lessThanOp', 'lessThanEqualOp', 'greaterOp', 'greaterThanEqualOp', 'equalToOp',
      'notEqualOp', 'addAssignOp', 'subtractAssignOp', 'multiplyAssignOp', 'dividerAssignOp',
      'moduloAssignOp', 'notEqualOp', 'equalToOp', 'terminator', 'period', 'comma', 'colon',
      'L_paren', 'R_paren', 'L_curl', 'R_curl', 'L_sqr', 'R_sqr', 'NS', 'WS', 'increment',
      'decrement'
    ],

    // Record similar identifier names
    similarID: []
  },
  getters: {
		lexemes: state => state.finalTokenStream,
    errors: state => state.errors
	},
  mutations: {
    CLEAR_TOKENS(state) {
      state.initialTokenStream = [];
      state.finalTokenStream = [];
      state.similarID = [];
    },
    SET_INITIAL_TOKENS(state, payload) {
      state.initialTokenStream = [...payload];
    },
    ADD_TO_FINAL_STREAM(state, payload) {
      state.finalTokenStream.push(payload);
    },
    CLEAR_ERRORS(state) {
      state.errors = []
    },
    ADD_ERROR(state, payload) {
      state.errors.push(payload);
    },
    ADD_TO_SIMILAR_ID(state, payload) {
      state.similarID.push(payload);
    }
  },
  actions: {
    async ANALYZE({ state, dispatch, commit }, code) {
      commit('CLEAR_TOKENS');
      let lineCounter;
      let currentToken;

      const tokenStream = [];
      const parser = moo.compile(state.rules);
      let reader = parser.reset(code);

      let token = true;
      while(token) {
        try {
          token = reader.next();
          currentToken = token;
          // console.log(token);
          if (token) {
            // console.log('lexer token: ', token)
            tokenStream.push({
              lexeme: token.value,
              token: `${token.type}`,
              line: token.line,
              col: token.col
            });
            lineCounter = token.line
          }

        } catch(err) {
          console.log(err.message);
          const errMessage = err.message.split('\n');

          if (errMessage.length) {
            const indexOfPointer = errMessage[3].indexOf("^");
            const maySala = errMessage[2].charAt(indexOfPointer);
            commit('ADD_ERROR', {
              type: 'LEX',
              code: 'invalid-token',
              message: `Unexpected token -> ${maySala}`,
              line: lineCounter
            })
          }
        }
      }

      commit('SET_INITIAL_TOKENS', tokenStream);
      await dispatch('ANALYZE_DELIMITERS');
      await dispatch('GROUP_SAME_ID');
      return true;
    },
    // end of ANALYZE action

    async ANALYZE_DELIMITERS({ state, commit }) {
      const empty = { token: '', line: null, col: null };
      const len = state.initialTokenStream.length;

      let quotationEncountered = false;

      for (let index = 0; index < len; index++) {
        // const prev = index - 1 > 0 ? state.initialTokenStream[index - 1] : empty;
        const current = state.initialTokenStream[index];
        const next = index + 1 !== len ? state.initialTokenStream[index + 1] : empty;

        // if comment is the next token from the current
        // omit it already
        if (next.token === 'comment' || next.token === 'multilineComment') {
          if (current.token !== 'WS' && current.token !== 'NL') {
            commit('ADD_TO_FINAL_STREAM', current);
          }
          continue;
        }

        // Handle invalid characters
        if (current.token === 'invalid') {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-character',
            message: `Unexpected character found -> ${current.lexeme}`,
            line: current.line,
            col: current.col
          });
          continue;
        }

        // Handle missing quotations for string literals
        if (current.token === 'quotations' && !quotationEncountered) {
          quotationEncountered = true;
          continue;
        } else if (quotationEncountered && state.stoppers.includes(current.token)) {
          if (current.token !== 'NL' && current.token !== 'WS') {
            commit('ADD_TO_FINAL_STREAM', current);
          }

          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'missing-string-quotation',
            message: 'String literal has missing quotation',
            line: current.line,
            col: current.col
          });
          quotationEncountered = false;
          continue;
        } else if (quotationEncountered) {
          continue;
        }

        // if consecutive tokens are both id, return an error
        // since this only means that the id exceeded the limit of characters
        if (current.token === 'id' && next.token === 'id') {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'identifier-limit-exceeded',
            message: 'Identifier length exceeded',
            line: current.line,
            col: current.col
          })
          continue;
        }

        // if consecutive tokens are both number literal, return an error
        // since this only means that the number literal exceeded the limit of characters
        if (
          state.numbers.includes(current.token)
          && state.numbers.includes(next.token)
        ) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'numbers-limit-exceeded',
            message: 'Number Literal length limit exceeded',
            line: current.line,
            col: current.col
          })
          continue;
        }

        //negative symbols followed by another negative symbol is invalid
        const negaSignDelimInvalid = !state.delims.negaSign.includes(next.token);
        if (current.token === 'negaSign' && negaSignDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiter',
            message: `Invalid use of negative symbol.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        // check if the next token to ID is valid
        const idDelimInvalid = !state.delims.id.includes(next.token)
          && !state.operators.includes(next.token);
        if (current.token === 'id' && idDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Unexpected token after a variable name.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        // check if the next token to data type keywords are invalid
        const isTokenDataType = state.dataTypes.includes(current.token);
        const dataTypeDelimInvalid = !state.delims.dataTypes.includes(next.token);
        if (isTokenDataType && dataTypeDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Unexpected token after (${current.lexeme}), was expecting space or newline.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        // check if the next token to keyword is valid
        const isTokenAKeyword = state.keywords.includes(current.token);
        const keywordDelimInvalid = !state.delims.keywords.includes(next.token);
        if (isTokenAKeyword && keywordDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Unexpected token after (${current.lexeme}), was expecting (.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const isTokenOperator = state.operators.includes(current.token);
        const operatorDelimInvalid = !state.delims.operators.includes(next.token);
        if (isTokenOperator && operatorDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Unexpected token after an operator`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const isKeywordControl = state.controls.includes(current.token);
        const controlDelimInvalid = !state.delims.control.includes(next.token);
        if (isKeywordControl && controlDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Semi-colon is required at the end of control statements`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const returnDelimInvalid = !state.delims.return_word.includes(next.token);
        if (current.token === 'return_word' && returnDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Invalid token after the return keyword.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const elseDelimInvalid = !state.delims.else.includes(next.token);
        if (current.token === 'else' && elseDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Unexpected token after (${current.lexeme}), was expecting {.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const periodDelimInvalid = !state.delims.period.includes(next.token);
        if (current.token === 'period' && periodDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Invalid token after dot (.) symbol.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const isTokenUnary = state.unary.includes(current.token);
        const unaryDelimInvalid = !state.delims.unary.includes(next.token);
        if (isTokenUnary && unaryDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Invalid token after unary operator.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const notOpDelimInvalid = !state.delims.notOp.includes(next.token);
        if (current.token === 'notOp' && notOpDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Invalid token after not (!) operator.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const isTokenNumber = state.numbers.includes(current.token);
        const numberDelimInvalid = !state.delims.numbers.includes(next.token);
        if (isTokenNumber && numberDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Invalid token after a number literal.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const stringDelimInvalid = !state.delims.stringLit.includes(next.token);
        if (current.token === 'stringLit' && stringDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Invalid token after a string literal.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const isTokenBoolLit = state.boolLit.includes(current.token);
        const boolLitDelimInvalid = !state.delims.boolLit.includes(next.token);
        if (isTokenBoolLit && boolLitDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Invalid token after a boolean literal.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const nullDelimInvalid = !state.delims.null.includes(next.token);
        if (current.token === 'null' && nullDelimInvalid) {
          commit('ADD_ERROR', {
            type: 'LEX',
            code: 'invalid-delimiters',
            message: `Invalid token after a null literal.`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        // just push the token if no error is found
        if (current.token !== 'WS' && current.token !== 'NL') {
          commit('ADD_TO_FINAL_STREAM', current);
        }
      }
    },
    // end of ANALYZE_DELIMS action

    async GROUP_SAME_ID({ state, commit }) {
      for (const token of state.finalTokenStream) {
        const existingIDIndex = state.similarID.findIndex(id => token.lexeme === id);
        if (token.token === 'id' && existingIDIndex >= 0) {
          token.token = `id-${existingIDIndex + 1}`
        } else if (token.token === 'id' && existingIDIndex === -1) {
          commit('ADD_TO_SIMILAR_ID', token.lexeme);
          token.token = `id-${state.similarID.length}`
        }
      }
    }
    // end of GROUP_SAME_ID action
  }
}