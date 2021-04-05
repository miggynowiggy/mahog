const moo = require("moo");

export default {
  namespaced: true,
  state: {
    tokenStream: [],
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
          "absorb": "absorb",
          "insert": "insert",
          "uproot": "uproot",
          "atChar": "atChar"
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
      arith_op: ["-", "*", "/", "%"]
    }
  },
  getters: {
		lexemes: (state) => state.tokenStream.filter(token => token.token !== '<NL>')
	},
  mutations: {
    CLEAR_LEXEMES(state) {
      state.tokenStream = []
    }
  },
  actions: {
    async ANALYZE({ state, rootState }, code) {
      state.tokenStream = [];
      try {
        const tokenStream = [];
        const parser = moo.compile(state.rules);
        code += "\n";
        let reader = parser.reset(code);

        let token = " ";
        while(token) {
          token = reader.next();
          // Ensure to only get the tokens that is not a whitespace
          if (token) {
            tokenStream.push({
              lexeme: token.value,
              arrow: "-->",
              token: `<${token.type}>`,
              line: token.line,
              col: token.col
            });
          }
        }

        state.tokenStream = tokenStream.filter(t => t.token !== "<NL>" && t.token !== "<WS>");
      } catch(err) {
        console.log(err.message);
        rootState.syntax.errors.push({ message: err.message });
      }
    },
    async ANALYZE_DELIMITERS({ state, rootState }) {

    }
  }
}