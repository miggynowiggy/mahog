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
          "return": "return",
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
      comment: /[@].*\n/,

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
      moduloOp: "%"
    },

    // Delims
    delims: {
      negaSign: [
        'NL', 'WS', 'id', 'LParen', 'negaFloatNumLit', 'floatNumLit',
        'negaNumLit', 'numLit'
      ],
      id: [
        'NL', 'WS', 'comma', 'period', 'colon', 'terminator', 'increment',
        'decrement', 'LSqr', 'LCurl', 'LParen', 'RParen', 'RCurl', 'RSqr'
      ],
      dataTypes: ['NL', 'WS', 'id'],
      keywords: ['NL', 'WS', 'LParen'],
      control: ['NL', 'WS', 'terminator'],
      unary: ['NL', 'WS', 'terminator', 'RCurl', 'RSqr', 'RParen'],
      return: [
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
        'terminator', 'addOp', 'addAssignOp', 'equalToOp', 'notEqualOp'
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
    boolLit: ['true', 'false']
  },
  getters: {
		lexemes: state => state.finalTokenStream,
    errors: state => state.errors
	},
  mutations: {
    CLEAR_TOKENS(state) {
      state.initialTokenStream = [];
      state.finalTokenStream = [];
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

      try {
        let token = " ";
        while(token) {
          token = reader.next();
          currentToken = token;
          if (token) {
            tokenStream.push({
              lexeme: token.value,
              token: `${token.type}`,
              line: token.line,
              col: token.col
            });
            lineCounter = token.line
          }
        }

        tokenStream.push({
          lexeme: " ",
          token: "WS",
          line: lineCounter + 1,
          col: 0
        });

        commit('SET_INITIAL_TOKENS', tokenStream);
        const finalTokenStream = await dispatch('ANALYZE_DELIMITERS')
        return finalTokenStream;

      } catch(err) {
        console.log(err.message);
        const errMessage = err.message.split('\n');
        const indexOfPointer = errMessage[3].indexOf("^");
        const maySala = errMessage[2].charAt(indexOfPointer);
        commit('ADD_ERROR', {
          code: 'invalid-token',
          message: `Unexpected token -> ${maySala}`,
          line: lineCounter
        })
      }
    },

    async ANALYZE_DELIMITERS({ state, commit }) {
      const empty = { token: '', line: null, col: null };
      const len = state.initialTokenStream.length;

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

        // if consecutive tokens are both id, return an error
        // since this only means that the id exceeded the limit of characters
        if (current.token === 'id' && next.token === 'id') {
          commit('ADD_ERROR', {
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
            code: 'invalid-delimiters',
            message: `Semi-colon is required at the end of control statements`,
            line: current.line,
            col: current.col
          })
          continue;
        }

        const returnDelimInvalid = !state.delims.return.includes(next.token);
        if (current.token === 'return' && returnDelimInvalid) {
          commit('ADD_ERROR', {
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

      return state.finalTokenStream;
    }
  }
}