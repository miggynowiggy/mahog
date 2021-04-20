// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const moo = require("moo");
  //const IndentationLexer = require("moo-indentation-lexer")

  const lexer = moo.compile({
    id: "id",
    data_type: "dataType",
    constant: "constant",
    typecase: "typecast",
    object: "object",
    if_word: "if",
    elif: "elif",
    else_word: "else",
    cycle: "cycle",
    during: "during",
    output: "output",
    input: "input",
    control: "control",
    return_word: "return",
    trim: "trim",
    size: "size",
    null_word: "null",
    void_word: "void",
    arr_access: "arrAccess",
    str_access: "str_access",
    pos_access: "posAccess",
    comment: "comment",
    multiline: "multiline",

    comma: "comma",
    colon: "colon",
    period: "period",
    terminator: "terminator",

    L_paren: "LParen",
    R_paren: "RParen",
    L_curl: "LCurl",
    R_curl: "RCurl",
    L_sqr: "LSqr",
    R_sqr: "RSqr",

    nega_sign: "negaSign",
    add_assign_op: "addAssignOp",
    assign_only_op: "assignOnlyOp",
    assign_op: "assignOp",
    relate_op: "relateOp",
    arith_op: "arithOp",
    add_op: "addOp",
    not_op: "notOp",
    or_op: "orOp",
    unary: "unary",

    string_lit: "stringLit",
    bool_lit: "boolLit",
    nega_float_num_lit: "negaFloatNumLit",
    float_num_lit: "floatNumLit",
    nega_num_lit: "negaNumLit",
    num_lit: "numLit"
  });
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["statement"]},
    {"name": "statement", "symbols": ["desired_statement", "statement"]},
    {"name": "statement", "symbols": []},
    {"name": "desired_statement", "symbols": ["declare_data"]},
    {"name": "desired_statement", "symbols": ["const_declare"]},
    {"name": "desired_statement", "symbols": ["object_declare"]},
    {"name": "desired_statement", "symbols": ["void_declare"]},
    {"name": "desired_statement", "symbols": ["return_statement"]},
    {"name": "desired_statement", "symbols": ["id_use"]},
    {"name": "declare_data", "symbols": ["data_id", "data_choices"]},
    {"name": "data_id", "symbols": [(lexer.has("data_type") ? {type: "data_type"} : data_type), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "data_choices", "symbols": [(lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "data_choices", "symbols": ["function_dec"]},
    {"name": "data_choices", "symbols": [(lexer.has("assign_only_op") ? {type: "assign_only_op"} : assign_only_op), "data_nonfunction", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "data_nonfunction", "symbols": ["literals"]},
    {"name": "data_nonfunction", "symbols": ["array_literal"]},
    {"name": "data_nonfunction", "symbols": ["id_use"]},
    {"name": "const_declare", "symbols": ["const_start", (lexer.has("assign_only_op") ? {type: "assign_only_op"} : assign_only_op), "literals", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "const_start", "symbols": [(lexer.has("constant") ? {type: "constant"} : constant), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "object_declare", "symbols": ["object_id", "object_choice"]},
    {"name": "object_choice", "symbols": [(lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "object_choice", "symbols": [(lexer.has("assign_only_op") ? {type: "assign_only_op"} : assign_only_op), "object_wrapper", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "object_id", "symbols": [(lexer.has("object") ? {type: "object"} : object), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "object_wrapper", "symbols": [(lexer.has("L_curl") ? {type: "L_curl"} : L_curl), "object_content", (lexer.has("R_curl") ? {type: "R_curl"} : R_curl)]},
    {"name": "object_content", "symbols": ["data_id", (lexer.has("colon") ? {type: "colon"} : colon), "data_nonfunction", "append_property"]},
    {"name": "object_content", "symbols": []},
    {"name": "append_property", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "object_content"]},
    {"name": "append_property", "symbols": []},
    {"name": "assign_op", "symbols": [(lexer.has("assign_op") ? {type: "assign_op"} : assign_op)]},
    {"name": "assign_op", "symbols": [(lexer.has("assign_only_op") ? {type: "assign_only_op"} : assign_only_op)]},
    {"name": "assign_op", "symbols": [(lexer.has("add_assign_op") ? {type: "add_assign_op"} : add_assign_op)]},
    {"name": "literals", "symbols": ["num_literals"]},
    {"name": "literals", "symbols": [(lexer.has("string_lit") ? {type: "string_lit"} : string_lit)]},
    {"name": "literals", "symbols": [(lexer.has("bool_lit") ? {type: "bool_lit"} : bool_lit)]},
    {"name": "num_literals", "symbols": [(lexer.has("nega_float_num_lit") ? {type: "nega_float_num_lit"} : nega_float_num_lit)]},
    {"name": "num_literals", "symbols": [(lexer.has("float_num_lit") ? {type: "float_num_lit"} : float_num_lit)]},
    {"name": "num_literals", "symbols": [(lexer.has("nega_num_lit") ? {type: "nega_num_lit"} : nega_num_lit)]},
    {"name": "num_literals", "symbols": [(lexer.has("num_lit") ? {type: "num_lit"} : num_lit)]},
    {"name": "id_use", "symbols": [(lexer.has("id") ? {type: "id"} : id), "assign_choice"]},
    {"name": "assign_choice", "symbols": ["assign_data"]},
    {"name": "assign_choice", "symbols": ["function_call", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "assign_choice", "symbols": []},
    {"name": "assign_data", "symbols": ["assign_op", "data_nonfunction", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "array_literal", "symbols": [(lexer.has("L_sqr") ? {type: "L_sqr"} : L_sqr), "array_contents", (lexer.has("R_sqr") ? {type: "R_sqr"} : R_sqr)]},
    {"name": "array_contents", "symbols": ["literals", "append_element"]},
    {"name": "array_contents", "symbols": [(lexer.has("L_sqr") ? {type: "L_sqr"} : L_sqr), "array_contents", (lexer.has("R_sqr") ? {type: "R_sqr"} : R_sqr), "append_element"]},
    {"name": "array_contents", "symbols": []},
    {"name": "append_element", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "array_contents"]},
    {"name": "append_element", "symbols": []},
    {"name": "void_declare", "symbols": [(lexer.has("void_word") ? {type: "void_word"} : void_word), (lexer.has("id") ? {type: "id"} : id), "function_dec"]},
    {"name": "function_dec", "symbols": ["paren_wrapper", (lexer.has("L_curl") ? {type: "L_curl"} : L_curl), "statement", (lexer.has("R_curl") ? {type: "R_curl"} : R_curl)]},
    {"name": "function_call", "symbols": ["paren_wrapper"]},
    {"name": "paren_wrapper", "symbols": [(lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "paren_content", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "paren_content", "symbols": ["data_nonfunction", "paren_content_append"]},
    {"name": "paren_content", "symbols": []},
    {"name": "paren_content_append", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "paren_content"]},
    {"name": "paren_content_append", "symbols": []},
    {"name": "return_statement", "symbols": [(lexer.has("return_word") ? {type: "return_word"} : return_word), "return_content"]},
    {"name": "return_content", "symbols": ["data_nonfunction", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "return_content", "symbols": ["paren_wrapper", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "return_content", "symbols": [(lexer.has("terminator") ? {type: "terminator"} : terminator)]}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
