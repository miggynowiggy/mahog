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
      relateOp: ["!=", "==", ">", "<", ">=", "<="],
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
      negaSign: ['NL', 'WS', 'id', 'LParen'],
      id: [
        'NL', 'WS', 'comma', 'period', 'colon', 'terminator', 'unary',
        'LSqr', 'LCurl', 'LParen', 'RParen', 'arithOp', 'addOp', 'notOp', 'andOp',
        'orOp', 'assignOp', 'relateOp', 'assignOnlyOp', 'addAssignOp'
      ],
      dataType: ['NL', 'WS', 'comment', 'multiline', 'id'],
      constant: ['NL', 'WS', 'comment', 'multiline', 'id'],
      object: ['NL', 'WS', 'comment', 'multiline', 'id'],
      void: ['NL', 'WS', 'id'],
      keywords: ['NL', 'WS', 'LParen'],
      control: ['terminator'],
      else: ['NL', 'WS', 'LCurl'],
      period: ['NL', 'WS', 'id', 'strAccess', 'arrAccess', 'posAccess'],
      notOp: ['id', 'LParen', 'boolLit'],
      boolLit: ['NL', 'WS', 'terminator', 'notOp', 'andOp', 'orOp', 'relateOp'],
    },
    nonNegaNum: ['floatNumLit', 'numLit'],
    negaNum: ['negaFloatLit', 'negaNumLit'],
    numbers: ['negaFloatNumLit', 'floatNumLit', 'negaNumLit', 'numLit'],
    keywords: [
      'posAccess', 'strAccess', 'arrAccess', 'typecast', 'trim', 'size',
      'output', 'input', 'during', 'cycle', 'if', 'elif'
    ],
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
      state.tokenStream = []
    }
  },
  actions: {
    async ANALYZE({ state, rootState }, code) {
      state.tokenStream = [];
      let lineCounter;
      try {
        const tokenStream = [];
        const parser = moo.compile(state.rules);
        code += "\n";
        let reader = parser.reset(code);

        let token = " ";
        while(token) {
          token = reader.next();
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
      } catch(err) {
        console.log(err.message);
        rootState.syntax.errors.push({ code: 'invalid-token', message: err.message, line: lineCounter });
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

        const dataTypeDelimInvalid = !state.delims.dataType.includes(next.token);
        if (current.token === 'dataType' && dataTypeDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Unexpected token after ${current.lexeme}, was expecting space or newline.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const constantTypeDelimInvalid = !state.delims.constant.includes(next.token);
        if (current.token === 'constant' && constantTypeDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Unexpected token after ${current.lexeme}, was expecting space or newline.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const objectTypeDelimInvalid = !state.delims.object.includes(next.token);
        if (current.token === 'object' && objectTypeDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Unexpected token after ${current.lexeme}, was expecting space or newline.`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const voidTypeDelimInvalid = !state.delims.void.includes(next.token);
        if (current.token === 'void' && voidTypeDelimInvalid) {
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

        const controlDelimInvalid = !state.delims.control.includes(next.token);
        if (current.token === 'period' && controlDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Semi-colon is required at the end of control statements`,
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

        const boolLitDelimInvalid = !state.delims.boolLit.includes(next.token);
        if (current.token === 'boolLit' && boolLitDelimInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiters',
            message: `Invalid token after boolean literal.`,
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