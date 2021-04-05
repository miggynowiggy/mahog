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
			let tokenStream = [...rootState.lexical.tokenStream];

			try {
				for (const token of tokenStream) {
					console.log(token.token);
					tagaParse.feed(token.token);
					const { results } = tagaParse;
					console.log(results);
				}

			} catch(err) {
				console.error(err.message);
				state.errors.push({ message: err.message });
			}
		},
	},
};
