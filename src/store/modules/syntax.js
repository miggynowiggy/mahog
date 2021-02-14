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
		ANALYZE({ state, rootState }, code) {
			try {
				const tagaParse = new nearley.Parser(
					nearley.Grammar.fromCompiled(grammar)
				);
				const tokenStream = [...rootState.lexical.tokenStream];
				// console.log(rootState.lexical.tokenStream);
				let stringifiedToken = "";
				// let stringifiedLines = [];
				// for (const token of tokenStream) {
				// 	if (token.token === '<NL>') {
				// 		stringifiedLines.push(stringifiedToken);
				// 	} else {
				// 		stringifiedToken += token.token;
				// 	}
				// }
				for (const token of tokenStream) {
					stringifiedToken += token.token;
				}
				tagaParse.feed(stringifiedToken)
				console.log(tagaParse.results);
				// for (const line of stringifiedLines) {
				// 	console.log(line);
				// 	console.log(tagaParse.feed(line));
				// }

			} catch(err) {
				console.log(err.message);
				state.errors.push({ message: err.message });
			}
		},
	},
};
