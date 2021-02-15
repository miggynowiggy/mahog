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
				let tokenStream = [...rootState.lexical.tokenStream];

				let stringifiedToken = "";
				let stringifiedLines = [];
				for (const token of tokenStream) {
					if (token.token === '<NL>' && stringifiedToken !== "") {
						stringifiedLines.push(stringifiedToken);
						stringifiedToken = "";
					} else {
						stringifiedToken += token.token;
					}
				}

				// tagaParse.feed(stringifiedToken)
				// console.log(tagaParse.results);
				// console.log(stringifiedLines);
				for (let line of stringifiedLines) {
					console.log(line);
					tagaParse.feed(line)
					console.log(tagaParse.results.flat())
				}

			} catch(err) {
				console.log(err.message);
				state.errors.push({ message: err.message });
			}
		},
	},
};
