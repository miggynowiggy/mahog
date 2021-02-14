const moo = require("moo");

export default {
  namespaced: true,
  state: {
    tokenStream: [],
    rules: {
      WS: /[ \t]+/,
      NL: { match: /\n|\r\n|\r/, lineBreaks: true },
      constType: "stone",
      dataTypes: ["seed", "number", "boolean", "string"],
      obj: "object",
      voidFunc: "void",
      nullState: "null",
      water: "water",
      carve: "carve",
      ifState: "if",
      elifState: "elif",
      elseState: "else",
      cycle: "cycle",
      during: "during",
      control: ["skip", "break"],
      returnState: "return",
      sizeState: "size",
      typeCast: ["num", "str", "bol"],
      strAccess: ".atChar",
      trimState: "trim",
      // arrFunc: [".absorb", ".insert", ".uproot"],
      absorbState: ".absorb",
      insertState: ".insert",
      uprootState: ".upRoot",
      boolLit: ["true", "false"],
      negaFloatLit: /^-[0-9]{1,9}[\.][0-9]{1,9}/,
      posFloatLit: /^[0-9]{1,9}[\.][0-9]{1,9}/,
      nonNegaNumLit: /[0-9]{1,9}/,
      negaNumLit: /^-[0-9]{1,9}/,
      // stringLit: /^[\"|\'].+[\"|\']$/,
      stringLit: [
        {match: /"""[^]*?"""/, lineBreaks: true, value: x => x.slice(3, -3)},
        {match: /"(?:\\["\\rn]|[^"\\\n])*?"/, value: x => x.slice(1, -1)},
        {match: /'(?:\\['\\rn]|[^'\\\n])*?'/, value: x => x.slice(1, -1)}
      ],
      id: /[a-zA-Z_]{1}[a-zA-Z0-9_]{0,25}/,
      comment: /^@.*\n/,
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
      unary: ["++", "--"],
      addOp: "+",
      addAssignOp: "+=",
      assignOp: ["=", "+=", "-=", "*=", "/=", "%="],
      relateOp: ["!=", "==", ">", "<", ">=", "<="],
      notOp: "!",
      andOp: "&&",
      orOp: "||",
      arithOp: ["-", "*", "/", "%"]
    }
  },
  getters: {
		lexemes: (state) => state.tokenStream.map(token => { return {...token, arrow: "-->"} })
	},
  mutations: {
    CLEAR_LEXEMES(state) {
      state.tokenStream = []
    }
  },
  actions: {
    async ANALYZE({ state, rootState, dispatch }, code) {
      state.tokenStream = [];
      try {
        const tokenStream = [];
        const parser = moo.compile(state.rules);
        let reader = parser.reset(code);

        let token = " ";
        while(token) {
          token = reader.next();
          // Ensure to only get the tokens that is not a whitespace
          if (token && token.type !== 'NL' && token.type !== 'WS') {
            tokenStream.push({
              lexeme: token.value,
              token: `<${token.type}>`,
              line: token.line,
              col: token.col
            });
          }
        }

        state.tokenStream = tokenStream;
      } catch(err) {
        console.log(err.message);
        rootState.syntax.errors.push({ message: err.message });
      }
    }
  }
}