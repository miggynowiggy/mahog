// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const moo = require("moo");
    //const IndentationLexer = require("moo-indentation-lexer")

    const lexer = moo.compile({
      data_type: "dataType",
      id: "id",
      terminator: "terminator",
      constant: "constant",
      assign_op: "assignOp",
      string_lit: "stringLit",
      bool_lit: "boolLit",
      nega_float_num_lit: "negaFloatNumLit",
      float_num_lit: "floatNumLit",
      nega_num_lit: "negaNumLit",
      num_lit: "numLit",
      L_sqr: "LSqr",
      R_sqr: "RSqr",
      comma: "comma"
    });
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["statement"]},
    {"name": "statement", "symbols": ["desired_statement", "statement"]},
    {"name": "statement", "symbols": []},
    {"name": "desired_statement", "symbols": ["declare_data"]},
    {"name": "desired_statement", "symbols": ["const_declare"]},
    {"name": "desired_statement", "symbols": ["assign_data"]},
    {"name": "declare_data", "symbols": ["data_id", "data_choices"]},
    {"name": "data_id", "symbols": [(lexer.has("data_type") ? {type: "data_type"} : data_type), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "data_choices", "symbols": [(lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "data_choices", "symbols": [(lexer.has("assign_op") ? {type: "assign_op"} : assign_op), "data_nonfunction", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "data_nonfunction", "symbols": ["literals"]},
    {"name": "data_nonfunction", "symbols": ["array_literal"]},
    {"name": "const_declare", "symbols": ["const_start", (lexer.has("assign_op") ? {type: "assign_op"} : assign_op), "literals", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "const_start", "symbols": [(lexer.has("constant") ? {type: "constant"} : constant), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "assign_op", "symbols": [{"literal":"assign_op"}]},
    {"name": "literals", "symbols": ["num_literals"]},
    {"name": "literals", "symbols": [(lexer.has("string_lit") ? {type: "string_lit"} : string_lit)]},
    {"name": "literals", "symbols": [(lexer.has("bool_lit") ? {type: "bool_lit"} : bool_lit)]},
    {"name": "num_literals", "symbols": [(lexer.has("nega_float_num_lit") ? {type: "nega_float_num_lit"} : nega_float_num_lit)]},
    {"name": "num_literals", "symbols": [(lexer.has("float_num_lit") ? {type: "float_num_lit"} : float_num_lit)]},
    {"name": "num_literals", "symbols": [(lexer.has("nega_num_lit") ? {type: "nega_num_lit"} : nega_num_lit)]},
    {"name": "num_literals", "symbols": [(lexer.has("num_lit") ? {type: "num_lit"} : num_lit)]},
    {"name": "assign_data", "symbols": [(lexer.has("id") ? {type: "id"} : id), (lexer.has("assign_op") ? {type: "assign_op"} : assign_op), "data_nonfunction", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "array_literal", "symbols": [(lexer.has("L_sqr") ? {type: "L_sqr"} : L_sqr), "array_contents", (lexer.has("R_sqr") ? {type: "R_sqr"} : R_sqr)]},
    {"name": "array_contents", "symbols": ["literals", "append_element"]},
    {"name": "append_element", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "array_contents"]},
    {"name": "append_element", "symbols": []}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
