/* eslint-disable no-prototype-builtins */
/* eslint-disable no-useless-escape */
const JisonLex = require("jison-lex");
const unicode = require("unicode-categories");
// const _ = require("underscore");

export default {
	namespaced: true,
	state: {
		tokenStream: [],
		grammar: {
			rules: [
				["\\s+", "/* skip whitespace */"],

				[`[s][t][o][n][e]`, "return 'constType';"],
				["[s][e][e][d]", "return 'dataTypes';"],
				["[n][u][m][b][e][r]", "return 'dataTypes';"],
				["[s][t][r][i][n][g]", "return 'dataTypes';"],
				["[b][o][o][l][e][a][n]", "return 'dataTypes';"],
				["[o][b][j][e][c][t]", "return 'object';"],
				["[v][o][i][d]", "return 'void';"],
				["[n][u][l][l]", "return 'null';"],
				["[w][a][t][e][r]", "return 'water';"],
				["[c][a][r][v][e]", "return 'carve';"],
				["[e][l][i][f]", "return 'elsif';"],
				["[i][f]", "return 'if';"],
				["[e][l][s][e]", "return 'else';"],
				["[c][y][c][l][e]", "return 'cycle';"],
				["[d][u][r][i][n][g]", "return 'during';"],
				["[s][k][i][p]", "return 'control';"],
				["[b][r][e][a][k]", "return 'control';"],
				["[r][e][t][u][r][n]", "return 'return';"],
				["[s][i][z][e]", "return 'size';"],
				["[n][u][m]", "return 'typeCast';"],
				["[s][t][r]", "return 'typeCast';"],
				["[b][o][l]", "return 'typeCast';"],
				["[a][t][C][h][a][r]", "return 'strAccess';"],
				[`[t][r][i][m]`, "return 'precision';"],
				[`[.][a][b][s][o][r][b]`, "return 'arrFunction';"],
				[`[.][i][n][s][e][r][t]`, "return 'arrFunction';"],
				[`[.][u][p][r][o][o][t]`, "return 'arrFunction';"],
				["[t][r][u][e]", "return 'boolLiteral';"],
				["[f][a][l][s][e]", "return 'boolLiteral';"],

				[`[\\@].+`, "return 'comment';"],
				[
					`^-?[0-9]+(\.[0-9]+)?([eE][\-\+]?[0-9]+)?`,
					"return '<numberLiteral>';",
				],
				[`[\\"].+[\\"]`, "return 'stringLiteral';"],
				[`[\\'].+[\\']`, "return 'stringLiteral';"],
				[
					`${unicode.ECMA.identifier.source.replace("\\u03BB", "")}`,
					"return 'id';",
				],

				["\\;", "return 'terminator';"],
				["\\,", "return 'comma';"],
				["\\.", "return 'dot';"],
				["\\:", "return 'colon';"],
				["\\(", "return 'openParen';"],
				["\\)", "return 'closeParen';"],
				["{", "return 'openBrace';"],
				["}", "return 'closeBrace';"],
				["\\[", "return 'openBracket';"],
				["\\]", "return 'closeBracket';"],


				["[\\+]{2}", "return 'unary';"],
				["[\\-]{2}", "return 'unary';"],
				["[\\+][\\=]", "return 'assign_op';"],
				["[\\-][\\=]", "return 'assign_op';"],
				["[\\*][\\=]", "return 'assign_op';"],
				["[\\/][\\=]", "return 'assign_op';"],
				["[\\%][\\=]", "return 'assign_op';"],
				["[\\!][\\=]", "return 'relate_op';"],
				["\\={2}", "return 'relate_op';"],
				["\\>{1}", "return 'relate_op';"],
				["\\<{1}", "return 'relate_op';"],
				["\\<\\=", "return 'relate_op';"],
				["\\>\\=", "return 'relate_op';"],
				["\\!{1}", "return 'logic_op';"],
				["\\&{2}", "return 'logic_op';"],
				["\\|{2}", "return 'logic_op';"],
				["\\+{1}", "return 'arith_op';"],
				["-{1}", "return 'arith_op';"],
				["\\*", "return 'arith_op';"],
				["\\/", "return 'arith_op';"],
				["\\%", "return 'arith_op';"],
				["\\=", "return 'assign_op';"],
			],
		},
	},
	getters: {
		lexemes: (state) => state.tokenStream,
	},
	actions: {
		async ANALYZE({ state, dispatch, commit, rootState }, code) {
			const lexer = new JisonLex(state.grammar);
			const tokenLines = await dispatch("tokenizer/ANALYZE", code, {
				root: true,
			});
			console.log(tokenLines);

			// lexer.setInput(code);
			const tokenStream = [];
			const tokensForSyntax = [];
			const lineLength = tokenLines.length;
			for (let lineIndex = 0; lineIndex < lineLength; lineIndex++) {
				const line = tokenLines[lineIndex];

				for (const token of line) {
					lexer.input();
					const tokenDeets = {
						lexeme: token,
						token: lexer.lex(),
						line: lineIndex + 1,
					};
					tokenStream.push(tokenDeets);
					console.log(lexer, token, " -> ", tokenDeets.token);
				}
			}

			state.tokenStream = tokenStream;
			rootState.syntax = tokensForSyntax;
			return tokenStream;
		},
	},
};
