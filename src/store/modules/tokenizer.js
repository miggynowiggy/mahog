/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-empty-pattern */

// This is a RegExp checker that returns true if the string matches the patters of the regex given
const checkStr = (regex, expr) => {
	return new RegExp(regex).test(expr);
};

export default {
	namespaced: true,
	state: {
		keywords: {
			stone: "data_types",
			seed: "data_types",
			number: "data_types",
			boolean: "data_types",
			string: "data_types",
			object: "data_types",
			void: "void",
			null: "null",
			water: "input",
			carve: "output",
			if: "if",
			else: "else",
			elif: "elif",
			cycle: "for loop",
			during: "while loop",
			skip: "control",
			break: "control",
			true: "bool_lit",
			false: "bool_lit",
			return: "return",
			size: "size",
			num: "type_cast",
			str: "type_cast",
			bol: "type_cast",
			atChar: "char_access",
			trim: "precision",
			absorb: "arr_functions",
			insert: "arr_functions",
			uproot: "arr_functions",
		},
		symbols: {
			"+": "arith_op",
			"-": "arith_op",
			"*": "arith_op",
			"/": "arith_op",
			"%": "arith_op",
			"++": "unary",
			"--": "unary",
			"+=": "assignment_op",
			"-=": "assignment_op",
			"*=": "assignment_op",
			"/=": "assignment_op",
			"%=": "assignment_op",
			"=": "assignment_op",
			"==": "relational_op",
			"!=": "relational_op",
			">": "relational_op",
			"<": "relational_op",
			">=": "relational_op",
			"<=": "relational_op",
			"!": "logical_op",
			"&&": "logical_op",
			"||": "logical_op",
		},
		delimiters: {
			";": ";",
			",": ",",
			".": ".",
			"(": "(",
			")": ")",
			"[": "[",
			"]": "]",
			"{": "{",
			"}": "}",
			":": ":",
			"@": "@",
			"@?": "@?",
			"?@": "?@",
		},
		numbers: /(-?)([0-9]{1,9})(.?)([0-9]{0,9})/,
		strings: /(\'|\").+(\'|\")/,
		booleans: /(true)|(false)/,
		identifiers: /([\w\d_]){1,25}/,
		escaping_chars: /(\n|\t|\r|\\|\\"|\\')/,
		whitespaces: [" ", "\n", "\t"],
		symbolChecker: /[!=\}\{\]\[\)\(><.,+-/*%&|;?"' \t\n]/,
		wordChecker: /[\w]/,

		//This is where all the lexemes will be found
		tokenStream: [],
	},
	getters: {
		lexemes: (state) => state.tokenStream,
	},
	mutations: {
		SET_LEXEMES(state, payload) {
			state.tokenStream = payload;
		},
	},
	actions: {
		//Code the logic of the lexical analyzer here.
		// @Params { code } - String, this is the code written by the user
		ANALYZE({ state, commit }, code) {
			//token format
			/*
				{
					lexeme: stringified,
					token: `${state.delimiters[stringified]}`,
					line,
				}
			*/

			const tokenStream = [];
			const lines = code.split("\n");
			for (let line of lines) {
				line += "\n";
				let tokensByLine = [];
				let wordsContainer = [];
				let commentFlag = false;

				// Assemble tokens that are literals and identifiers in nature
				for (let lineIndex = 0; lineIndex < line.length; lineIndex++) {
					const char = line[lineIndex];

					// Assemble the whole single line comment as a single token
					if (!commentFlag && char === "@") {
						commentFlag = true;
						wordsContainer.push(char);
					} else if (commentFlag && char === " ") {
						wordsContainer.push(char);
					} else if (commentFlag && char === "\n") {
						const formedToken = wordsContainer.join("");
						tokensByLine.push(formedToken.trim());
						wordsContainer = [];
						commentFlag = false;
					}

					// Form the non-comment tokens
					else if (new RegExp(state.symbolChecker).test(char)) {
						const formedToken = wordsContainer.join("");
						tokensByLine.push(formedToken);
						tokensByLine.push(char); //reserved symbols are pushed also to the token stream
						wordsContainer = [];
					} else {
						wordsContainer.push(char); //keep on assembling the tokens
					}
				}

				//Filter out tokens that has spaces on the start or end of the string
				//Or simply remove tokens that only contains space or blank string
				tokensByLine = tokensByLine.filter(
					(token) => token !== "" && token !== "\n"
				);
				tokenStream.push(tokensByLine);
			}

			// Combine string literals and number literals as one token
			const tokenStreamLen = tokenStream.length;
			for (let index = 0; index < tokenStreamLen; index++) {
				let line = tokenStream[index];

				const lineLen = line.length;
				const newLineContent = [];
				let strLitHolder = "";
				let numLitHolder = "";
				let symbolHolder = "";
				let commentHolder = "";
				let strFound = false;
				let commentFound;

				for (let tokenIndex = 0; tokenIndex < lineLen; tokenIndex++) {
					const token = line[tokenIndex];
					const nextToken =
						tokenIndex + 1 !== lineLen ? line[tokenIndex + 1] : "";
					const isTokenQuotaionMark = token === '"' || token === "'";
					const isTokenNumber = checkStr(state.numbers, token);
					const isTokenDecimal = token === ".";
					const isNextTokenDecimal = nextToken === ".";
					const isNextTokenNumber = checkStr(state.numbers, nextToken);
					const isTokenSymbol = state.symbols.hasOwnProperty(token);
					const isNextTokenSymbol = state.symbols.hasOwnProperty(nextToken);

					// if consecutive tokens forms a floating number / number,
					// consolidate it as a single string
					if (token === "-" && isNextTokenNumber) {
						numLitHolder += token;
					} else if (isTokenNumber && isNextTokenDecimal) {
						numLitHolder += token;
					} else if (isTokenDecimal && isNextTokenNumber) {
						numLitHolder += token;
					} else if (isTokenNumber && !isNextTokenNumber) {
						numLitHolder += token;
						newLineContent.push(numLitHolder);
						numLitHolder = "";
					}

					// If consecutive tokens forms a unary operator or other two-character symbols
					// consoliate it as a single string
					else if (!strFound && isTokenSymbol && isNextTokenSymbol) {
						symbolHolder += token;
					} else if (
						!strFound &&
						isTokenSymbol &&
						state.symbols.hasOwnProperty(symbolHolder + token)
					) {
						symbolHolder += token;
						newLineContent.push(symbolHolder);
						symbolHolder = "";
					}

					// If the opening quotation mark is found, the following tokens will be
					// appended to form a string lit until the closing quotation mark is found
					else if (isTokenQuotaionMark && !strFound) {
						strLitHolder += token;
						strFound = true;
					} else if (strFound && !isTokenQuotaionMark) {
						strLitHolder += token;
					} else if (strFound && isTokenQuotaionMark) {
						strLitHolder += token;
						newLineContent.push(strLitHolder);
						strLitHolder = "";
						strFound = false;
					} else if (!strFound && token > " ") {
						newLineContent.push(token);
					}
				}
				tokenStream[index] = newLineContent.length ? newLineContent : line;
			}

			return tokenStream;
		},
	},
};
