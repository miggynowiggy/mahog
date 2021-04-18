const moo = require("moo");

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
          "strAccess": "atChar"
        })
      },

      NL: {match: /\n|\r\n|\r/, lineBreaks: true},
      WS: /[ \t]+/,

      negaFloatNumLit: /[~][0-9]{1,9}[\.][0-9]{1,9}/,
      floatNumLit: /[0-9]{1,9}[\.][0-9]{1,9}/,
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
      relateOp: ["!=", "==", ">", "<", ">=", "<="],
      assignOp: ["=", "-=", "*=", "/=", "%="],
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
      nonNegaNum: ['floatNumLit', 'nulLit'],
      negaNum: ['negaFloatLit', 'negaNumLit'],
      numbers: ['negaFloatNumLit', 'floatNumLit', 'negaNumLit', 'numLit'],
      arrAccess: ['absorb', 'insert', 'uproot'],
      strAccess: ['atChar']
    }
  },
  getters: {
		lexemes: (state) => state.tokenStream.filter(token => token.token !== '<NL>' && token.token !== '<WS>')
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
              arrow: "-->",
              token: `${token.type}`,
              line: token.line,
              col: token.col
            });
            lineCounter = token.line
          }
        }

        state.tempTokenStream = tokenStream.filter(t => t.token !== "NL" && t.token !== "WS");
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

        // const isTokenDataDec = current.token === 'data_type' || current.token === 'constant' || current.token === 'object';
        // if (isTokenDataDec && next.token !== 'id') {
        //   rootState.syntax.errors.push({
        //     code: 'invalid-token',
        //     message: 'Missing variable name after data type',
        //     line: current.line,
        //     col: current.col
        //   });
        //   return;
        // }

        // if consecutive tokens are both number literal, return an error
        // since this only means that the number literal exceeded the limit of characters
        if (
          state.delims.numbers.includes(current.token)
          && state.delims.numbers.includes(next.token)
        ) {
          rootState.syntax.errors.push({
            code: 'numbers-limit-exceeded',
            message: 'Number Literal length limit exceeded',
            line: current.line,
            col: current.col
          });
          return;
        }

        // if the keyword after dot is not a method or a property
        // throw an error
        const isPeriodInvalid = next.token !== 'arrAccess' && next.token !== 'strAccess' && next.token !== 'id';
        if (current.token === 'period' && isPeriodInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-dot-usage',
            message: 'Unexpected token after the dot(.) symbol',
            line: current.line,
            col: current.col
          });
          return;
        }

        if (current.token === 'arrAccess' && next.token !== 'LParen') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: 'Unexpected token after array access method',
            line: current.line,
            col: current.col
          });
          return;
        }

        const isCurrentFunction = current.token === 'typecast' || current.token === 'trim';
        if (isCurrentFunction && next.token !== 'LParen') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: 'Unexpected token after type casting keyword',
            line: current.line,
            col: current.col
          });
          return;
        }

        const isCurrentConditional = current.token === 'if' || current.token === 'elif';
        if (isCurrentConditional && next.token !== 'LParen') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Unexpected token after "${current.lexeme}" keyword`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const isElseInvalid = next.token === 'LParen' || next.token === 'RParen';
        if (current.token === 'else' && isElseInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Unexpected token after "${current.lexeme}" keyword`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const isCurrentIOOps = current.token === 'output' || current.token === 'input';
        if (isCurrentIOOps && next.token !== 'LParen') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Unexpected token after "${current.lexeme}" keyword`,
            line: current.line,
            col: current.col
          });
          return;
        }

        if (current.token === 'control' && next.token !== 'terminator') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Unexpected token after "${current.lexeme}" keyword`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const isCurrentLoop = current.token === 'during' || current.token === 'cycle';
        if (isCurrentLoop && next.token !== 'LParen') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Unexpected token after "${current.lexeme}" keyword`,
            line: current.line,
            col: current.col
          });
          return;
        }

        //negative symbols followed by another negative symbol is invalid
        const validNegaToken = next.token === 'id' || next.token === 'LParen' || state.delims.nonNegaNum.includes(next.token);
        if (current.token === 'negaSign' && !validNegaToken) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Unexpected token after negative symbol`,
            line: current.line,
            col: current.col
          });
          return;
        }

        state.tokenStream.push(current);
      }
    }
  }
}