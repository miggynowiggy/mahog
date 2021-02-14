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

				[`^stone$`, "return '<data_types>';"],
				["^seed$", "return '<data_types>';"],
				["^number$", "return '<data_types>';"],
				["^string$", "return '<data_types>';"],
				["^boolean$", "return '<data_types>';"],
				["^object$", "return '<object>';"],
				["^void$", "return '<void>';"],
				["^null$", "return '<null>';"],
				["^water$", "return 'water';"],
				["^carve$", "return 'carve';"],
				["^elif$", "return 'elsif';"],
				["^if$", "return 'if';"],
				["^else$", "return 'else';"],
				["^cycle$", "return 'cycle';"],
				["^during$", "return 'during';"],
				["^skip$", "return '<control>';"],
				["^continue$", "return '<control>';"],
				["^return$", "return 'return';"],
				["^size$", "return 'size';"],
				["^num$", "return '<type_cast>';"],
				["^str$", "return '<type_cast>';"],
				["^bol$", "return '<type_cast>';"],
				["^atChar$", "return '<str_access>';"],
				[`^trim$`, "return '<precision>';"],
				[`^\.absorb$`, "return '<arr_functions>';"],
				[`^\.insert$`, "return '<arr_functions>';"],
				[`^\.uproot$`, "return '<arr_functions>';"],
				["^true$", "return '<bool_literal>';"],
				["^false$", "return '<bool_literal>';"],

				[`[\\@].+`, "return '<single_comment>';"],
				[
					`^-?[0-9]+(\.[0-9]+)?([eE][\-\+]?[0-9]+)?`,
					"return '<number_literal>';",
				],
				[`[\\"].+[\\"]`, "return '<string_literal>';"],
				[`[\\'].+[\\']`, "return '<string_literal>';"],
				[
					`${unicode.ECMA.identifier.source.replace("\\u03BB", "")}`,
					"return '<identifier>';",
				],

				["[\\+]{2}", "return '<unary>';"],
				["[\\-]{2}", "return '<unary>';"],
				["[\\+][\\=]", "return '<assign_op>';"],
				["[\\-][\\=]", "return '<assign_op>';"],
				["[\\*][\\=]", "return '<assign_op>';"],
				["[\\/][\\=]", "return '<assign_op>';"],
				["[\\%][\\=]", "return '<assign_op>';"],
				["[\\!][\\=]", "return '<relational_op>';"],
				["\\={2}", "return '<relational_op>';"],
				["\\>{1}", "return '<relational_op>';"],
				["\\<{1}", "return '<realtional_op>';"],
				["\\<\\=", "return '<realtional_op>';"],
				["\\>\\=", "return '<realtional_op>';"],
				["\\!{1}", "return '<logic_op>';"],
				["\\&{2}", "return '<logic_op>';"],
				["\\|{2}", "return '<logic_op>';"],
				["\\+{1}", "return '<arith_op>';"],
				["-{1}", "return '<arith_op>';"],
				["\\*", "return '<arith_op>';"],
				["\\/", "return '<arith_op>';"],
				["\\%", "return '<arith_op>';"],
				["\\=", "return '<assign_op>';"],
				["\\(", "return '(';"],
				["\\)", "return ')';"],
				["\\]", "return ']';"],
				["\\[", "return '[';"],
				["{", "return '{';"],
				["}", "return '}';"],
				["\\;", "return ';';"],
				["\\.", "return '.';"],
				["\\,", "return ',';"],
				["\\:", "return ':';"],
			],
		},
	},
	getters: {
		lexemes: (state) => state.tokenStream,
	},
	actions: {
		convertToPascal({ state }, token) {
			const splitedStr = token.split("_");
			return splitedStr.length ? token.split("_") : token;
		},
		async ANALYZE({ state, dispatch, commit }, code) {
			const lexer = new JisonLex(state.grammar);
			const tokenLines = await dispatch("tokenizer/ANALYZE", code, {
				root: true,
			});
			console.log(tokenLines);
			lexer.setInput(code);

			const tokenStream = [];
			const lineLength = tokenLines.length;
			for (let lineIndex = 0; lineIndex < lineLength; lineIndex++) {
				const line = tokenLines[lineIndex];

				for (const token of line) {
					const tokenDeets = {
						lexeme: token,
						token: lexer.lex(),
						line: lineIndex + 1,
					};
					tokenStream.push(tokenDeets);
					console.log(token, " -> ", tokenDeets.token);
				}
			}

			state.tokenStream = tokenStream;
			return tokenStream;
		},
	},
};
