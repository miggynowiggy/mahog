const moo = require("moo");

function isTokenWhitespace(token) {
  return token === 'WS' || token === 'NL';
}

export default {
  namespaced: true,
  state: {
    tokenStream: [],
    tempTokenStream: [],
    rules: {
      id: {
        match: /[_a-zA-Z][a-zA-Z0-9]{0,20}/,
        type: moo.keywords({
          "dataType": ["seed", "number", "string", "boolean"],
          "typecast": ["num", "str", "bool"],
          "constant": "stone",
          "object": "object",
          "if": "if",
          "elif": "elif",
          "else": "else",
          "output": "carve",
          "input": "water",
          "cycle": "cycle",
          "during": "during",
          "control": ["skip", "break"],
          "return": "return",
          "trim": "trim",
          "size": "size",
          "null": "null",
          "void": "void",
          "boolLit": ["true", "false"],
          "arrAccess": ["absorb", "insert", "uproot"],
          "strAccess": "atChar",
          "posAccess": "atPos"
        })
      },

      NL: {match: /\n|\r\n|\r/, lineBreaks: true},
      WS: /[ \t]+/,

      negaFloatNumLit: /[~][0-9]{0,9}[\.][0-9]{1,9}/,
      floatNumLit: /[0-9]{0,9}[\.][0-9]{1,9}/,
      negaNumLit: /[~][0-9]{1,9}/,
      numLit: /[0-9]{1,9}/,

      stringLit: [
        {match: /"""[^]*?"""/, lineBreaks: true, value: x => x.slice(3, -3)},
        {match: /"(?:\\["\\rn]|[^"\\\n])*?"/, value: x => x.slice(1, -1)},
        {match: /'(?:\\['\\rn]|[^'\\\n])*?'/, value: x => x.slice(1, -1)}
      ],

      multiline: [
        {
          match: /[@][?][^]*?[?][@]/,
          lineBreaks: true,
          value: x => x.slice(2, -2)
        }
      ],
      comment: /[@].*\n/,

      unary: ["++", "--"],
      addAssignOp: "+=",
      assignOnlyOp: "=",
      relateOpBool: ["!=", "=="], 
      relateOpNum: [">", "<", ">=", "<="],
      assignOp: ["-=", "*=", "/=", "%="],
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
      addOp: "+",
      notOp: "!",
      andOp: "&&",
      orOp: "||",
      negaSign: '~',
      arithOp: ["-", "*", "/", "%"]
    },
    delims: {
      negaSign: ['NL', 'WS', 'id', 'LParen', 'negaFloatNumLit', 'floatNumLit', 'negaNumLit', 'numLit'],
      id: [
        'NL', 'WS', 'comma', 'period', 'colon', 'terminator', 'unary',
        'LSqr', 'LCurl', 'LParen', 'RParen', 'RCurl', 'RSqr', 'arithOp',
        'addOp', 'notOp', 'andOp', 'orOp', 'assignOp', 'relateOp',
        'assignOnlyOp', 'addAssignOp'
      ],
      dataTypes: ['NL', 'WS', 'id', 'comment', 'multiline'],
      keywords: ['NL', 'WS', 'LParen'],
      control: ['terminator'],
      return: ['NL', 'WS', 'id', 'LParen', 'boolLit', 'stringLit', 'negaFloatNumLit', 'floatNumLit', 'negaNumLit', 'numLit', 'terminator'],
      else: ['NL', 'WS', 'LCurl'],
      period: ['NL', 'WS', 'id', 'strAccess', 'arrAccess', 'posAccess'],
      notOp: ['NL', 'WS', 'id', 'LParen', 'boolLit', 'notOp', 'negaFloatNumLit', 'floatNumLit', 'negaNumLit', 'numLit', 'stringLit'],
      operators: ['NL', 'WS', 'LParen', 'id', 'negaFloatNumLit', 'floatNumLit', 'negaNumLit', 'numLit', 'boolLit', 'stringLit', 'notOp'],
      numbers: ['NL', 'WS', 'comma', 'addOp', 'arithOp', 'relateOp', 'terminator', 'RSqr', 'RCurl', 'RParen', 'andOp', 'orOp'],
      boolLit: ['NL', 'WS', 'comma', 'andOp', 'orOp', 'relateOp', 'terminator', 'RSqr', 'RCurl', 'RParen'],
      stringLit: ['NL', 'WS', 'comma', 'period', 'addOp', 'RSqr', 'RCurl', 'RParen', 'terminator','arithOp'],
      null: ['NL', 'WS', 'relateOp', 'andOp', 'orOp', 'RSqr', 'RCurl', 'RParen', 'comma', 'terminator']
    },
    dataTypes: ['dataType', 'constant', 'object', 'void'],
    nonNegaNum: ['floatNumLit', 'numLit'],
    negaNum: ['negaFloatLit', 'negaNumLit'],
    numbers: ['negaFloatNumLit', 'floatNumLit', 'negaNumLit', 'numLit'],
    keywords: [
      'posAccess', 'strAccess', 'arrAccess', 'typecast', 'trim', 'size',
      'output', 'input', 'during', 'cycle', 'if', 'elif'
    ],
    operators: ['addAssignOp', 'assignOnlyOp', 'relateOp', 'assignOp', 'addOp', 'andOp', 'orOp', 'arithOp', 'notOp']
  },
  getters: {
		lexemes: (state) => state.tokenStream.map(token => {
      const newToken = { ...token };
      const expanded = {
        dataType: 'data type',
        boolLit: 'bool literal',
        arrAccess: 'array access',
        strAccess: 'string access',
        posAccess: 'character position',
        negaFloatNumLit: 'negative float number',
        floatNumLit: 'positive float number',
        negaNumLit: 'negative whole number',
        numLit: 'positive whole number',
        stringLit: 'string literal',
        multiline: 'multiline comment',
        addAssignOp: 'add-assign operator',
        assignOnlyOp: 'assignment operator',
        relateOp: 'relational operator',
        assignOp: 'assignment operator',
        addOp: 'arithmetic operator',
        arithOp: 'arithmetic operator',
        negaSign: 'negative symbol',
        notOp: 'logical operator',
        andOp: 'logical operator',
        orOp: 'logical operator',
        LParen: 'left parenthesis',
        RParen: 'right parenthesis',
        LCurl: 'left curly brace',
        RCulr: 'right curly brace',
        LSqr: 'left square bracket',
        RSqr: 'right square bracket',
      }
      newToken.token = expanded[token.token] ? expanded[token.token] : token.token;
      return newToken;
    })
	},
  mutations: {
    CLEAR_LEXEMES(state) {
      state.tokenStream = [];
      state.tempTokenStream = [];
    }
  },
  actions: {
    async ANALYZE({ state, rootState }, code) {
      state.tokenStream = [];
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

        state.tempTokenStream = [...tokenStream];
        state.tempTokenStream.push({
          lexeme: " ",
          token: "WS",
          line: lineCounter + 1,
          col: 0
        });
      } catch(err) {
        const errMessage = err.message.split('\n');
        console.log(errMessage);
        const indexOfPointer = errMessage[3].indexOf("^");
        const maySala = errMessage[2].charAt(indexOfPointer);
        rootState.syntax.errors.push({
          code: 'invalid-token',
          message: `Unexpected token -> ${maySala}`,
          line: lineCounter
        });
      }
    },
    async ANALYZE_DELIMITERS({ state, rootState }) {
      const empty = { token: '', line: null, col: null };
      const len = state.tempTokenStream.length;

      for (let index = 0; index < len; index++) {
        const prev = index - 1 > 0 ? state.tempTokenStream[index - 1] : empty;
        const current = state.tempTokenStream[index];
        const next = index + 1 !== len ? state.tempTokenStream[index + 1] : empty;

        // if comment is the next token from the current
        // omit it already
        if (next.token === 'comment' || next.token === 'multiline') {
          if (current.token !== 'WS' && current.token !== 'NL') {
            state.tokenStream.push(current);
          }
          continue;
        }

        // if consecutive tokens are both id, return an error
        // since this only means that the id exceeded the limit of characters
        if (current.token === 'id' && next.token === 'id') {
          rootState.syntax.errors.push({
            code: 'identifier-limit-exceeded',
            message: 'Identifier length exceeded',
            line: current.line,
            col: current.col
          });
          return;
        }

        // if consecutive tokens are both number literal, return an error
        // since this only means that the number literal exceeded the limit of characters
        if (
          state.numbers.includes(current.token)
          && state.numbers.includes(next.token)
        ) {
          rootState.syntax.errors.push({
            code: 'numbers-limit-exceeded',
            message: 'Number Literal length limit exceeded',
            line: current.line,
            col: current.col
          });
          return;
        }

        //negative symbols followed by another negative symbol is invalid
        const negaSignDelimInvalid = !state.delims.negaSign.includes(next.token);
        if (current.token === 'negaSign' && negaSignDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Invalid use of negative symbol.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const idDelimInvalid = !state.delims.id.includes(next.token);
        if (current.token === 'id' && idDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Unexpected token after a variable name.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const isTokenDataType = state.dataTypes.includes(current.token);
        const dataTypeDelimInvalid = !state.delims.dataTypes.includes(next.token);
        if (isTokenDataType && dataTypeDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Unexpected token after ${current.lexeme}, was expecting space or newline.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const isTokenAKeyword = state.keywords.includes(current.token);
        const keywordDelimInvalid = !state.delims.keywords.includes(next.token);
        if (isTokenAKeyword && keywordDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Unexpected token after ${current.lexeme}, was expecting (.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const isTokenOperator = state.operators.includes(current.token);
        const operatorDelimInvalid = !state.delims.operators.includes(next.token);
        if (isTokenOperator && operatorDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Unexpected token after an operator`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const controlDelimInvalid = !state.delims.control.includes(next.token);
        if (current.token === 'control' && controlDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Semi-colon is required at the end of control statements`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const returnDelimInvalid = !state.delims.return.includes(next.token);
        if (current.token === 'return' && returnDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Invalid token after the return keyword.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const elseDelimInvalid = !state.delims.else.includes(next.token);
        if (current.token === 'else' && elseDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Unexpected token after ${current.lexeme}, was expecting {.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const periodDelimInvalid = !state.delims.period.includes(next.token);
        if (current.token === 'period' && periodDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Invalid token after dot (.) symbol.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const notOpDelimInvalid = !state.delims.notOp.includes(next.token);
        if (current.token === 'notOp' && notOpDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Invalid token after not (!) operator.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const isTokenNumber = state.numbers.includes(current.token);
        const numberDelimInvalid = !state.delims.numbers.includes(next.token);
        if (isTokenNumber && numberDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Invalid token after a number literal.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const stringDelimInvalid = !state.delims.stringLit.includes(next.token);
        if (current.token === 'stringLit' && stringDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Invalid token after a string literal.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const boolLitDelimInvalid = !state.delims.boolLit.includes(next.token);
        if (current.token === 'boolLit' && boolLitDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Invalid token after a boolean literal.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const nullDelimInvalid = !state.delims.null.includes(next.token);
        if (current.token === 'null' && nullDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Invalid token after a null literal.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        if (current.token !== 'WS' && current.token !== 'NL') {
          state.tokenStream.push(current);
        }
      }
    }
  }
}