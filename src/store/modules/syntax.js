/* eslint-disable no-prototype-builtins */
// const { Parser } = require("jison");
const nearley = require("nearley");
const grammar = require("./grammar.js");
const cloneDeep = require('lodash/cloneDeep');
import tokens from './tokens';

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

				//split the error message into lines
				const splittedErrMessage = err.message.split("\n");

				// only get the lines that start with the word "A"
				// since it will contain which token are expected instead of the errouneous token
				const linesWithExpectedTokens = splittedErrMessage.filter(line => line.includes("A "));

				// identify the real name of the expected tokens
				let expectedTokens = '';
				const expectedTokensLength = linesWithExpectedTokens.length;
				for (let index = 0; index < expectedTokensLength; index++) {
					// the specific expected token is seen at the second element of the line
					const line = linesWithExpectedTokens[index];
					const words = line.split(" ");

					// this is just some styling fancy pants on showing the expected tokens
					if (index + 1 !== expectedTokensLength) {
						expectedTokens += '[ ' + tokens[words[1]] + ' ] or ';
					} else {
						expectedTokens += '[ ' + tokens[words[1]] + ' ]';
					}
				}

				commit('ADD_ERROR', {
					type: 'SYN',
					code: 'syntax-error',
					message: `
						Unexpected token -> [ ${currentToken.lexeme} ]
						instead was expecting -> ${expectedTokens}
					`,
					line: currentToken.line,
					col: currentToken.col
				})
				return false;
			}
		},
	},
};
