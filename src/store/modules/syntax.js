// const { Parser } = require("jison");
const nearley = require("nearley");
const grammar = require("./grammar.js");
const cloneDeep = require('lodash/cloneDeep');

export default {
	namespaced: true,
	state: {
		errors: []
	},
	getters: {
		errors: state => state.errors
	},
	mutations: {
		CLEAR_ERRORS(state) {
			state.errors = []
		},
		ADD_ERROR(state, payload) {
			state.errors.push(payload)
		}
	},
	actions: {
		async ANALYZE({ commit, rootGetters }) {
			const tagaParse = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

			const tokenStreamCopy = cloneDeep(rootGetters['lexical/lexemes']).filter(token => token.token !== 'comment' && token.token !== "multilineComment");
			let currentToken;
			try {
				for (const token of tokenStreamCopy) {
					currentToken = { ...token };
					tagaParse.feed(token.token);
					const { results } = tagaParse;
					console.log(currentToken, results, results.length);
				}

				return true;

			} catch(err) {
				console.log(err.message);
				const splittedErrMessage = err.message.split("\n");
				commit('ADD_ERROR', {
					type: 'SYN',
					code: 'syntax-error',
					// message: `
					// 	Unexpected token ${currentToken.lexeme} ,
					// 	instead was expecting ${splittedErrMessage[6].toLowerCase().replace("token based on:", "")}
					// `,
					message: `Unexpected token -> ${currentToken.lexeme}`,
					line: currentToken.line
				})
				return false;
			}
		},
	},
};
