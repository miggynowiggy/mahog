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
				assembledLine += token;
			}

			return assembledLine;
		},
		async ANALYZE({ state, rootState, dispatch }, code) {
			const tagaParse = new nearley.Parser(
				nearley.Grammar.fromCompiled(grammar)
			);
			let tokenStream = [...rootState.lexical.tokenStream];

			const lines = await dispatch("assembleTokens", tokenStream);
			try {
				console.log(lines);

				// tagaParse.feed(stringifiedToken)
				// console.log(tagaParse.results);
				// console.log(stringifiedLines);
				// for (let line of lines) {
				// 	console.log(line);
				// 	await tagaParse.feed(line);
				// 	const { results } = tagaParse;
				// 	console.log(results);
				// }

				tagaParse.feed(lines);
				const { results } = tagaParse;
				console.log(results);

			} catch(err) {
				console.error(err.message);
				state.errors.push({ message: err.message });
			}
		},
	},
};
