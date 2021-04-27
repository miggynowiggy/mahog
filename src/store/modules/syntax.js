// const { Parser } = require("jison");
const nearley = require("nearley");
const grammar = require("./grammar.js");
export default {
	namespaced: true,
	state: {
		jisonTokenized: null,
		errors: [],
	},
	getters: {
		errors: state => state.errors
	},
	mutations: {
		CLEAR_ERRORS(state) {
			state.errors = [];
		}
	},
	actions: {
		async assembleTokens({ state }, tokenStream) {
			let assembledLine = "";

			for (const tokenDeets of tokenStream) {
				const { token } = tokenDeets;
				assembledLine += token + " ";
			}

			return assembledLine;
		},
		async ANALYZE({ state, rootState, dispatch }, code) {
			const tagaParse = new nearley.Parser(
				nearley.Grammar.fromCompiled(grammar)
			);

			let tokenStream = rootState.lexical.tokenStream.filter(t => t.token !== 'comment' && t.token !== 'multiline');
			let currentToken;
			try {
				for (const token of tokenStream) {
					currentToken = { ...token };
					console.log(currentToken)
					tagaParse.feed(token.token);
					const { results } = tagaParse;
					console.log(token.token, results.length);
				}
			} catch(err) {
				console.log(err.message.split("\n"));
				const splittedErrMessage = err.message.split("\n");
				state.errors.push({
					code: 'syntax-error',
					message: `
						Unexpected token ${currentToken.lexeme},
						instead was expecting ${splittedErrMessage[6].toLowerCase().replace("token based on:", "")}
					`,
					line: currentToken.line
				});
			}
		},
	},
};
