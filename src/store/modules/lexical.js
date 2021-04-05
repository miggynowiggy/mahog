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
          "data_type": ["seed", "number", "string", "boolean"],
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
          "bool_lit": ["true", "false"],
          "arr_access": ["absorb", "insert", "uproot"],
          "str_access": "atChar"
        })
      },

      NL: {match: /\n|\r\n|\r/, lineBreaks: true},
      WS: /[ \t]+/,

      nega_float_num_lit: /[~][0-9]{1,9}[\.][0-9]{1,9}/,
      float_num_lit: /[0-9]{1,9}[\.][0-9]{1,9}/,
      nega_num_lit: /[~][0-9]{1,9}/,
      num_lit: /[0-9]{1,9}/,

      string_lit: [
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
      add_assign_op: "+=",
      relate_op: ["!=", "==", ">", "<", ">=", "<="],
      assign_op: ["=", "-=", "*=", "/=", "%="],
      terminator: ";",
      comma: ",",
      period: ".",
      colon: ":",
      L_paren: "(",
      R_paren: ")",
      L_sqr: "[",
      R_sqr: "]",
      L_curl: "{",
      R_curl: "}",
      add_op: "+",
      not_op: "!",
      and_op: "&&",
      or_op: "||",
      nega_sign: '~',
      arith_op: ["-", "*", "/", "%"]
    },
    delims: {
      non_nega_num: ['float_num_lit', 'nul_lit'],
      nega_num: ['nega_float_lit', 'nega_num_lit'],
      numbers: ['nega_float_num_lit', 'float_num_lit', 'nega_num_lit', 'num_lit'],
      arr_access: ['absorb', 'insert', 'uproot'],
      str_access: ['atChar']
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

        const isTokenDataDec = current.token === 'data_type' || current.token === 'constant' || current.token === 'object';
        if (isTokenDataDec && next.token !== 'id') {
          rootState.syntax.errors.push({
            code: 'invalid-token',
            message: 'Missing variable name after data type',
            line: current.line,
            col: current.col
          });
          return;
        }

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

        const isPeriodInvalid = next.token !== 'arr_access' && next.token !== 'str_access' && next.token !== 'id';
        if (current.token === 'period' && isPeriodInvalid) {
          rootState.syntax.errors.push({
            code: 'invalid-dot-usage',
            message: 'Unexpected token after the dot(.) symbol',
            line: current.line,
            col: current.col
          });
          return;
        }

        if (current.token === 'arr_access' && next.token !== 'L_paren') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: 'Unexpected token after array access method',
            line: current.line,
            col: current.col
          });
          return;
        }

        const isCurrentFunction = current.token === 'typecast' || current.token === 'trim';
        if (isCurrentFunction && next.token !== 'L_paren') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: 'Unexpected token after type casting keyword',
            line: current.line,
            col: current.col
          });
          return;
        }

        const isCurrentConditional = current.token === 'if' || current.token === 'elif';
        if (isCurrentConditional && next.token !== 'L_paren') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Unexpected token after "${current.lexeme}" keyword`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const isElseInvalid = next.token === 'L_paren' || next.token === 'R_paren';
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
        if (isCurrentIOOps && next.token !== 'L_paren') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Unexpected token after "${current.lexeme}" keyword`,
            line: current.line,
            col: current.col
          });
          return;
        }

        if (current.token === 'control' && next.token !== 'L_paren') {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Unexpected token after "${current.lexeme}" keyword`,
            line: current.line,
            col: current.col
          });
          return;
        }

        const isCurrentLoop = current.token === 'during' || current.token === 'cycle';
        if (isCurrentLoop && next.token !== 'L_paren') {
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

        const validNegaToken = next.token === 'id' || next.token === 'L_paren';
        if (current.token === 'nega_sign' && !validNegaToken) {
          rootState.syntax.errors.push({
            code: 'invalid-delimiter',
            message: `Unexpected token after negative symbol`,
            line: current.line,
            col: current.col
          });
          return;
        }

        // if negative sign was encountered before a negative float or whole number
        // throw an error, since double negative is not supported
        if (current.token === 'nega_sign' && state.delims.nega_num.includes(next.token)) {
          rootState.syntax.errors.push({
            code: 'invalid-double-negative',
            message: `Negative sign cannot be followed by another negative symbol`,
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