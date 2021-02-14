// const { Parser } = require("jison");
const nearley = require("nearley");
const grammar = require("./grammar.js");
export default {
	namespaced: true,
	state: {},
	getters: {},
	actions: {
		ANALYZE({ state }, code) {
			code = "stone miggy = 12.21;";
			const tagaParse = new nearley.Parser(
				nearley.Grammar.fromCompiled(grammar)
			);
			console.log(tagaParse.feed(code));
		},
	},
};
