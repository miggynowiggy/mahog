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
		async assembleRelatedTokens({ state }, tokenStream) {
			let bodyFound = false;
			const newLines = [];
			let assembledLine = "";
			for (const tokenDeets of tokenStream) {
				const { token } = tokenDeets;

				if (token === '<LCurl>') {
					bodyFound = true;
					assembledLine += token
				} else if (bodyFound && token === "<terminator>") {
					assembledLine += token;
					newLines.push(assembledLine);
					assembledLine = "";
					bodyFound = false;
				} else if (!bodyFound && token === "<terminator>") {
					assembledLine += token;
					newLines.push(assembledLine);
					assembledLine = "";
				} else {
					assembledLine += token;
				}
			}
			return newLines.filter(line => line !== '');
		},
		async ANALYZE({ state, rootState, dispatch }, code) {
			try {
				const tagaParse = new nearley.Parser(
					nearley.Grammar.fromCompiled(grammar)
				);
				let tokenStream = [...rootState.lexical.tokenStream];

				const lines = await dispatch("assembleRelatedTokens", tokenStream);
				console.log(lines);

				// tagaParse.feed(stringifiedToken)
				// console.log(tagaParse.results);
				// console.log(stringifiedLines);
				for (let line of lines) {
					console.log(line);
					await tagaParse.feed(line);
					const { results } = tagaParse;
					console.log(results);
				}

				// console.log(stringifiedToken);
				// tagaParse.feed(stringifiedToken);
				// const { results } = tagaParse;
				// console.log(results);

			} catch(err) {
				console.error(err.message);
				state.errors.push({ message: err.message });
			}
		},
	},
};
