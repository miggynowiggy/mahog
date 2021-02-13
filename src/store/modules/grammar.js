/* eslint-disable no-useless-escape */
var Generator = require("../lib/jison").Generator;
const unicode = require("unicode-categories");

exports.grammar = {
	lex: {
		macros: {
			digit: "[0-9]",
			esc: "\\\\",
			int: "-?(?:[0-9]|[1-9][0-9]+)",
			exp: "(?:[eE][-+]?[0-9]+)",
			frac: "(?:\\.[0-9]+)",
		},
		rules: [
			["\\s+", "/* skip whitespace */"],
			["{int}{frac}?{exp}?\\b", "return 'number_literal';"],
			[
				'"(?:{esc}["bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^"{esc}])*"',
				"yytext = yytext.substr(1,yyleng-2); return 'string_literal';",
			],
			[
				`'(?:{esc}["bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^"{esc}])*'`,
				"yytext = yytext.substr(1,yyleng-2); return 'string_literal';",
			],
			[
				`${unicode.ECMA.identifier.source.replace("\\u03BB", "")}`,
				"return 'identifier';",
			],
			["\\(", "return '('"],
			["\\)", "return ')'"],
			["\\{", "return '{'"],
			["\\}", "return '}'"],
			["\\[", "return '['"],
			["\\]", "return ']'"],
			[",", "return ','"],
			[":", "return ':'"],
			["\\.", "return '.'"],
			["true\\b", "return 'bool_literal'"],
			["false\\b", "return 'bool_literal'"],
			["null\\b", "return 'null'"],
		],
	},

	bnf: {
      num_lit: [],
		JSONString: ["STRING"],

		JSONNullLiteral: ["NULL"],

		JSONNumber: ["NUMBER"],

		JSONBooleanLiteral: ["TRUE", "FALSE"],

		JSONText: ["JSONValue"],

		JSONValue: [
			"JSONNullLiteral",
			"JSONBooleanLiteral",
			"JSONString",
			"JSONNumber",
			"JSONObject",
			"JSONArray",
		],

		JSONObject: ["{ }", "{ JSONMemberList }"],

		JSONMember: ["JSONString : JSONValue"],

		JSONMemberList: ["JSONMember", "JSONMemberList , JSONMember"],

		JSONArray: ["[ ]", "[ JSONElementList ]"],

		JSONElementList: ["JSONValue", "JSONElementList , JSONValue"],
	},
};

var options = { type: "slr", moduleType: "commonjs", moduleName: "jsoncheck" };

exports.main = function main() {
	var code = new Generator(exports.grammar, options).generate();
	console.log(code);
};

if (require.main === module) exports.main();
