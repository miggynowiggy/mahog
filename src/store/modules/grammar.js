// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const moo = require("moo");
  //const IndentationLexer = require("moo-indentation-lexer")

  const lexer = moo.compile({
    id: /id\-[0-9]{1,99}/,

    string_lit: "stringLit",
    nega_float_num_lit: "negaFloatNumLit",
    float_num_lit: "floatNumLit",
    nega_num_lit: "negaNumLit",
    num_lit: "numLit",
    bool_lit: ["true", "false"],
    null_word: "null",

    seed_datatype: "seed",
    number_datatype: "number",
    string_datatype: "string",
    boolean_datatype: "boolean",
    stone_datatype: "stone",
    void_datatype: "void",
    object_datatype: "object",

    num_typecast: "num",
    str_typecast: "str",
    bol_typecast: "bol",

    water: "water",
    carve: "carve",

    if_word: "if",
    elif: "elif",
    else_word: "else",

    cycle: "cycle",
    during: "during",
    skip_word: "skip",
    break_word: "break",

    return_word: "return_word",

    trim: "trim",
    size: "size",
    absorb: "absorb",
    insert_word: "insert",
    uproot: "uproot",
    atChar_word: "atChar",
    atPos_word: "atPos",

    comment: "comment",
    multiline: "multilineComment",

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
    add_op: "addOp",
    subtract_op: "subtractOp",
    multiply_op: "multiplyOp",
    divide_op: "divideOp",
    modulo_op: "moduloOp",

    add_assign_op: "addAssignOp",
    subtract_assign_op: "subtractAssignOp",
    multiply_assign_op: "multiplyAssignOp",
    divide_assign_op: "divideAssignOp",
    modulo_assign_op: "moduloAssignOp",

    assign_only_op: "assignOnlyOp",
    not_equal_op: "notEqualOp",
    equal_to_op: "equalToOp",

    not_op: "notOp",
    and_op: "andOp",
    or_op: "orOp",

    greater_than_op: "greaterThanOp",
    greater_equal_op: "greaterThanEqualOp",
    less_than_op: "lessThanOp",
    less_equal_op: "lessThanEqualOp",

    unary: ["increment", "decrement"],

    EOF: "EOF"
  });
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["statement", (lexer.has("EOF") ? {type: "EOF"} : EOF)]},
    {"name": "statement", "symbols": ["desired_statement", "statement"]},
    {"name": "statement", "symbols": []},
    {"name": "desired_statement", "symbols": ["data_declare"], "postprocess": id},
    {"name": "desired_statement", "symbols": ["const_declare"], "postprocess": id},
    {"name": "desired_statement", "symbols": ["object_declare"], "postprocess": id},
    {"name": "desired_statement", "symbols": ["void_declare"], "postprocess": id},
    {"name": "desired_statement", "symbols": ["id_assign"], "postprocess": id},
    {"name": "desired_statement", "symbols": ["output_statement"], "postprocess": id},
    {"name": "desired_statement", "symbols": ["if_statement"], "postprocess": id},
    {"name": "desired_statement", "symbols": ["loop_statement"], "postprocess": id},
    {"name": "desired_statement", "symbols": ["control"], "postprocess": id},
    {"name": "desired_statement", "symbols": ["trim_function", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "desired_statement", "symbols": ["type_casting", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "desired_statement", "symbols": ["size_function", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "desired_statement", "symbols": ["return_statement"], "postprocess": id},
    {"name": "id_assign", "symbols": ["ids", "id_yes"]},
    {"name": "id_yes", "symbols": [(lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "id_yes", "symbols": ["assign_op", "assignable_values", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "assignable_values", "symbols": ["input_statement"]},
    {"name": "assignable_values", "symbols": ["mixed_expressions"]},
    {"name": "assignable_values", "symbols": ["array_literal"]},
    {"name": "mixed_expressions", "symbols": ["mixed_operands", "mixed_adds"]},
    {"name": "mixed_operands", "symbols": ["literals"], "postprocess": id},
    {"name": "mixed_operands", "symbols": ["ids"], "postprocess": id},
    {"name": "mixed_operands", "symbols": ["type_casting"], "postprocess": id},
    {"name": "mixed_operands", "symbols": ["trim_function"], "postprocess": id},
    {"name": "mixed_operands", "symbols": ["size_function"], "postprocess": id},
    {"name": "mixed_operands", "symbols": [(lexer.has("not_op") ? {type: "not_op"} : not_op), "mixed_expressions"]},
    {"name": "mixed_operands", "symbols": [(lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "mixed_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "mixed_adds", "symbols": ["operator", "mixed_expressions"]},
    {"name": "mixed_adds", "symbols": []},
    {"name": "data_declare", "symbols": ["data_id", "data_choices"]},
    {"name": "data_choices", "symbols": [(lexer.has("assign_only_op") ? {type: "assign_only_op"} : assign_only_op), "assignable_values", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "data_choices", "symbols": ["function_dec"]},
    {"name": "data_choices", "symbols": [(lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "data_id", "symbols": [(lexer.has("number_datatype") ? {type: "number_datatype"} : number_datatype), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "data_id", "symbols": [(lexer.has("string_datatype") ? {type: "string_datatype"} : string_datatype), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "data_id", "symbols": [(lexer.has("boolean_datatype") ? {type: "boolean_datatype"} : boolean_datatype), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "data_id", "symbols": [(lexer.has("seed_datatype") ? {type: "seed_datatype"} : seed_datatype), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "const_declare", "symbols": ["const_start", (lexer.has("assign_only_op") ? {type: "assign_only_op"} : assign_only_op), "assignable_values", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "const_start", "symbols": [(lexer.has("stone_datatype") ? {type: "stone_datatype"} : stone_datatype), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "object_declare", "symbols": ["object_id", "object_choice"]},
    {"name": "object_id", "symbols": [(lexer.has("object_datatype") ? {type: "object_datatype"} : object_datatype), (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "object_choice", "symbols": [(lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "object_choice", "symbols": [(lexer.has("assign_only_op") ? {type: "assign_only_op"} : assign_only_op), "object_wrapper", (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "object_wrapper", "symbols": [(lexer.has("L_curl") ? {type: "L_curl"} : L_curl), "object_content", (lexer.has("R_curl") ? {type: "R_curl"} : R_curl)]},
    {"name": "object_content", "symbols": ["data_id", (lexer.has("colon") ? {type: "colon"} : colon), "assignable_values", "append_property"]},
    {"name": "object_content", "symbols": []},
    {"name": "append_property", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "object_content"]},
    {"name": "append_property", "symbols": []},
    {"name": "void_declare", "symbols": [(lexer.has("void_datatype") ? {type: "void_datatype"} : void_datatype), (lexer.has("id") ? {type: "id"} : id), "function_dec"]},
    {"name": "function_dec", "symbols": [(lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "dec_content", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren), "block_scope"]},
    {"name": "dec_content", "symbols": ["data_id", "dec_content_append"]},
    {"name": "dec_content", "symbols": []},
    {"name": "dec_content_append", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "dec_content"]},
    {"name": "dec_content_append", "symbols": []},
    {"name": "function_call", "symbols": ["paren_wrapper"]},
    {"name": "paren_wrapper", "symbols": [(lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "paren_content", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "paren_content", "symbols": ["mixed_expressions", "paren_content_append"]},
    {"name": "paren_content", "symbols": []},
    {"name": "paren_content_append", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "paren_content"]},
    {"name": "paren_content_append", "symbols": []},
    {"name": "block_scope", "symbols": [(lexer.has("L_curl") ? {type: "L_curl"} : L_curl), "statement", (lexer.has("R_curl") ? {type: "R_curl"} : R_curl)]},
    {"name": "arith_expressions", "symbols": ["arith_operand", "arith_expr_add"]},
    {"name": "arith_expr_add", "symbols": ["arith_operator", "arith_expressions"]},
    {"name": "arith_expr_add", "symbols": []},
    {"name": "arith_operand", "symbols": ["number_literals"], "postprocess": id},
    {"name": "arith_operand", "symbols": ["typecast_num"]},
    {"name": "arith_operand", "symbols": ["trim_function"], "postprocess": id},
    {"name": "arith_operand", "symbols": ["size_function"], "postprocess": id},
    {"name": "arith_operator", "symbols": ["arith_op"], "postprocess": id},
    {"name": "arith_operator", "symbols": ["assign_with_op"], "postprocess": id},
    {"name": "arith_operator", "symbols": ["relate_op"], "postprocess": id},
    {"name": "str_expressions", "symbols": ["str_operand", "str_expr_add"]},
    {"name": "str_expr_add", "symbols": ["str_operator", "str_expressions"]},
    {"name": "str_expr_add", "symbols": []},
    {"name": "str_operand", "symbols": [(lexer.has("string_lit") ? {type: "string_lit"} : string_lit), "additional_str_method"]},
    {"name": "str_operand", "symbols": ["typecast_str"]},
    {"name": "str_operator", "symbols": [(lexer.has("add_op") ? {type: "add_op"} : add_op)]},
    {"name": "str_operator", "symbols": [(lexer.has("add_assign_op") ? {type: "add_assign_op"} : add_assign_op)]},
    {"name": "str_operator", "symbols": ["relate_op"]},
    {"name": "operator", "symbols": ["arith_op"], "postprocess": id},
    {"name": "operator", "symbols": ["relate_op"], "postprocess": id},
    {"name": "operator", "symbols": ["assign_with_op"], "postprocess": id},
    {"name": "operator", "symbols": ["logical_op"], "postprocess": id},
    {"name": "expressions", "symbols": ["ids", "id_expr_add"]},
    {"name": "id_expr_add", "symbols": ["operator", "expressions_with_lit"]},
    {"name": "id_expr_add", "symbols": []},
    {"name": "expressions_with_lit", "symbols": ["ids", "id_expr_add"]},
    {"name": "expressions_with_lit", "symbols": ["literals", "id_expr_add"]},
    {"name": "init_expressions", "symbols": ["init_operands", "init_expr_add"]},
    {"name": "init_expr_add", "symbols": ["arith_operator", "init_expressions"]},
    {"name": "init_expr_add", "symbols": []},
    {"name": "init_operands", "symbols": ["number_literals"], "postprocess": id},
    {"name": "init_operands", "symbols": ["ids"], "postprocess": id},
    {"name": "init_operands", "symbols": ["typecast_num"]},
    {"name": "init_operands", "symbols": ["trim_function"], "postprocess": id},
    {"name": "init_operands", "symbols": ["size_function"], "postprocess": id},
    {"name": "init_operands", "symbols": [(lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "init_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "atChar_expressions", "symbols": ["atChar_operands", "str_expr_add"]},
    {"name": "atChar_operands", "symbols": ["str_expressions"], "postprocess": id},
    {"name": "atChar_operands", "symbols": ["ids"], "postprocess": id},
    {"name": "atChar_operands", "symbols": [(lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "atChar_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "arith_expr_add_paren", "symbols": ["arith_operator", "arith_expr_add_paren_yes"]},
    {"name": "arith_expr_add_paren", "symbols": []},
    {"name": "arith_expr_add_paren_yes", "symbols": ["arith_expressions"]},
    {"name": "arith_expr_add_paren_yes", "symbols": [(lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "arith_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "str_expr_add_paren", "symbols": ["str_operator", "str_expr_add_paren_yes"]},
    {"name": "str_expr_add_paren", "symbols": []},
    {"name": "str_expr_add_paren_yes", "symbols": ["str_expressions"]},
    {"name": "str_expr_add_paren_yes", "symbols": [(lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "str_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "arith_op", "symbols": [(lexer.has("add_op") ? {type: "add_op"} : add_op)]},
    {"name": "arith_op", "symbols": [(lexer.has("subtract_op") ? {type: "subtract_op"} : subtract_op)]},
    {"name": "arith_op", "symbols": [(lexer.has("multiply_op") ? {type: "multiply_op"} : multiply_op)]},
    {"name": "arith_op", "symbols": [(lexer.has("divide_op") ? {type: "divide_op"} : divide_op)]},
    {"name": "arith_op", "symbols": [(lexer.has("modulo_op") ? {type: "modulo_op"} : modulo_op)]},
    {"name": "relate_op", "symbols": ["relate_op_num"], "postprocess": id},
    {"name": "relate_op", "symbols": ["relate_op_bool"], "postprocess": id},
    {"name": "relate_op_num", "symbols": [(lexer.has("greater_than_op") ? {type: "greater_than_op"} : greater_than_op)]},
    {"name": "relate_op_num", "symbols": [(lexer.has("less_than_op") ? {type: "less_than_op"} : less_than_op)]},
    {"name": "relate_op_num", "symbols": [(lexer.has("greater_equal_op") ? {type: "greater_equal_op"} : greater_equal_op)]},
    {"name": "relate_op_num", "symbols": [(lexer.has("less_equal_op") ? {type: "less_equal_op"} : less_equal_op)]},
    {"name": "relate_op_bool", "symbols": [(lexer.has("not_equal_op") ? {type: "not_equal_op"} : not_equal_op)]},
    {"name": "relate_op_bool", "symbols": [(lexer.has("equal_to_op") ? {type: "equal_to_op"} : equal_to_op)]},
    {"name": "assign_op", "symbols": ["assign_operators"], "postprocess": id},
    {"name": "assign_op", "symbols": [(lexer.has("assign_only_op") ? {type: "assign_only_op"} : assign_only_op)]},
    {"name": "assign_op", "symbols": [(lexer.has("add_assign_op") ? {type: "add_assign_op"} : add_assign_op)]},
    {"name": "assign_with_op", "symbols": ["assign_operators"], "postprocess": id},
    {"name": "assign_with_op", "symbols": [(lexer.has("add_assign_op") ? {type: "add_assign_op"} : add_assign_op)]},
    {"name": "assign_operators", "symbols": [(lexer.has("subtract_assign_op") ? {type: "subtract_assign_op"} : subtract_assign_op)]},
    {"name": "assign_operators", "symbols": [(lexer.has("multiply_assign_op") ? {type: "multiply_assign_op"} : multiply_assign_op)]},
    {"name": "assign_operators", "symbols": [(lexer.has("divide_assign_op") ? {type: "divide_assign_op"} : divide_assign_op)]},
    {"name": "assign_operators", "symbols": [(lexer.has("modulo_assign_op") ? {type: "modulo_assign_op"} : modulo_assign_op)]},
    {"name": "logical_op", "symbols": [(lexer.has("and_op") ? {type: "and_op"} : and_op)]},
    {"name": "logical_op", "symbols": [(lexer.has("or_op") ? {type: "or_op"} : or_op)]},
    {"name": "literals", "symbols": ["number_literals"], "postprocess": id},
    {"name": "literals", "symbols": [(lexer.has("string_lit") ? {type: "string_lit"} : string_lit), "additional_str_method"]},
    {"name": "literals", "symbols": [(lexer.has("bool_lit") ? {type: "bool_lit"} : bool_lit)]},
    {"name": "number_literals", "symbols": ["whole_numbers"], "postprocess": id},
    {"name": "number_literals", "symbols": ["float_numbers"], "postprocess": id},
    {"name": "whole_numbers", "symbols": [(lexer.has("num_lit") ? {type: "num_lit"} : num_lit)]},
    {"name": "whole_numbers", "symbols": [(lexer.has("nega_num_lit") ? {type: "nega_num_lit"} : nega_num_lit)]},
    {"name": "float_numbers", "symbols": [(lexer.has("float_num_lit") ? {type: "float_num_lit"} : float_num_lit)]},
    {"name": "float_numbers", "symbols": [(lexer.has("nega_float_num_lit") ? {type: "nega_float_num_lit"} : nega_float_num_lit)]},
    {"name": "str_methods", "symbols": ["atPos_method"]},
    {"name": "str_methods", "symbols": ["atChar_method"]},
    {"name": "atPos_method", "symbols": [(lexer.has("atPos_word") ? {type: "atPos_word"} : atPos_word), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "init_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "atChar_method", "symbols": [(lexer.has("atChar_word") ? {type: "atChar_word"} : atChar_word), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "atChar_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "ids", "symbols": [(lexer.has("id") ? {type: "id"} : id), "array_access", "unary", "call_function", "object_access"]},
    {"name": "object_access", "symbols": [(lexer.has("period") ? {type: "period"} : period), "object_yes"]},
    {"name": "object_access", "symbols": []},
    {"name": "object_yes", "symbols": [(lexer.has("id") ? {type: "id"} : id), "array_access", "unary"]},
    {"name": "object_yes", "symbols": ["str_methods"]},
    {"name": "object_yes", "symbols": ["arr_methods"]},
    {"name": "unary", "symbols": [(lexer.has("unary") ? {type: "unary"} : unary)]},
    {"name": "unary", "symbols": []},
    {"name": "call_function", "symbols": ["function_call"]},
    {"name": "call_function", "symbols": []},
    {"name": "array_access", "symbols": [(lexer.has("L_sqr") ? {type: "L_sqr"} : L_sqr), "mixed_expressions", (lexer.has("R_sqr") ? {type: "R_sqr"} : R_sqr), "arr_2D"]},
    {"name": "array_access", "symbols": []},
    {"name": "arr_2D", "symbols": [(lexer.has("L_sqr") ? {type: "L_sqr"} : L_sqr), "mixed_expressions", (lexer.has("R_sqr") ? {type: "R_sqr"} : R_sqr)]},
    {"name": "arr_2D", "symbols": []},
    {"name": "array_literal", "symbols": [(lexer.has("L_sqr") ? {type: "L_sqr"} : L_sqr), "array_contents", (lexer.has("R_sqr") ? {type: "R_sqr"} : R_sqr)]},
    {"name": "array_contents", "symbols": ["mixed_expressions", "append_element"]},
    {"name": "array_contents", "symbols": [(lexer.has("L_sqr") ? {type: "L_sqr"} : L_sqr), "mixed_expressions", "append_element_2d_yes", (lexer.has("R_sqr") ? {type: "R_sqr"} : R_sqr), "append_element"]},
    {"name": "array_contents", "symbols": []},
    {"name": "append_element", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "array_contents"]},
    {"name": "append_element", "symbols": []},
    {"name": "append_element_2d_yes", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "mixed_expressions", "append_element_2d_yes"]},
    {"name": "append_element_2d_yes", "symbols": []},
    {"name": "arr_methods", "symbols": [(lexer.has("absorb") ? {type: "absorb"} : absorb), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "array_contents", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "arr_methods", "symbols": [(lexer.has("insert_word") ? {type: "insert_word"} : insert_word), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "arith_expressions", (lexer.has("comma") ? {type: "comma"} : comma), "array_contents", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "arr_methods", "symbols": [(lexer.has("uproot") ? {type: "uproot"} : uproot), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "arith_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "typecast_str", "symbols": [(lexer.has("str_typecast") ? {type: "str_typecast"} : str_typecast), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "mixed_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "typecast_num", "symbols": [(lexer.has("num_typecast") ? {type: "num_typecast"} : num_typecast), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "mixed_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "typecast_bol", "symbols": [(lexer.has("bol_typecast") ? {type: "bol_typecast"} : bol_typecast), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "mixed_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "type_casting", "symbols": ["typecast_str"]},
    {"name": "type_casting", "symbols": ["typecast_num"]},
    {"name": "type_casting", "symbols": ["typecast_bol"]},
    {"name": "trim_function", "symbols": [(lexer.has("trim") ? {type: "trim"} : trim), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "trim_param", (lexer.has("comma") ? {type: "comma"} : comma), "arith_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "trim_param", "symbols": ["float_numbers"]},
    {"name": "trim_param", "symbols": ["ids"]},
    {"name": "input_statement", "symbols": [(lexer.has("water") ? {type: "water"} : water), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "input_choices", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "input_choices", "symbols": ["str_expressions"]},
    {"name": "additional_str_method", "symbols": [(lexer.has("period") ? {type: "period"} : period), "str_methods"]},
    {"name": "additional_str_method", "symbols": []},
    {"name": "output_statement", "symbols": [(lexer.has("carve") ? {type: "carve"} : carve), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "mixed_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren), (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "size_function", "symbols": [(lexer.has("size") ? {type: "size"} : size), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "size_function_choices", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren)]},
    {"name": "size_function_choices", "symbols": ["str_expressions"]},
    {"name": "size_function_choices", "symbols": ["array_literal"]},
    {"name": "size_function_choices", "symbols": ["ids"]},
    {"name": "if_statement", "symbols": [(lexer.has("if_word") ? {type: "if_word"} : if_word), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "mixed_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren), "block_scope", "elif_statement", "else_statement"]},
    {"name": "elif_statement", "symbols": [(lexer.has("elif") ? {type: "elif"} : elif), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "mixed_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren), "block_scope"]},
    {"name": "elif_statement", "symbols": []},
    {"name": "else_statement", "symbols": [(lexer.has("else_word") ? {type: "else_word"} : else_word), "block_scope"]},
    {"name": "else_statement", "symbols": []},
    {"name": "loop_statement", "symbols": [(lexer.has("during") ? {type: "during"} : during), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "mixed_expressions", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren), "block_scope"]},
    {"name": "loop_statement", "symbols": [(lexer.has("cycle") ? {type: "cycle"} : cycle), (lexer.has("L_paren") ? {type: "L_paren"} : L_paren), "cycle_condition", (lexer.has("R_paren") ? {type: "R_paren"} : R_paren), "block_scope"]},
    {"name": "cycle_condition", "symbols": ["init_loop", (lexer.has("terminator") ? {type: "terminator"} : terminator), "cond_loop", (lexer.has("terminator") ? {type: "terminator"} : terminator), "paren_unary"]},
    {"name": "init_loop", "symbols": [(lexer.has("number_datatype") ? {type: "number_datatype"} : number_datatype), (lexer.has("id") ? {type: "id"} : id), (lexer.has("assign_only_op") ? {type: "assign_only_op"} : assign_only_op), "init_expressions"]},
    {"name": "init_loop", "symbols": [(lexer.has("id") ? {type: "id"} : id), (lexer.has("assign_only_op") ? {type: "assign_only_op"} : assign_only_op), "init_expressions"]},
    {"name": "init_loop", "symbols": []},
    {"name": "cond_loop", "symbols": ["mixed_expressions"]},
    {"name": "cond_loop", "symbols": []},
    {"name": "paren_unary", "symbols": [(lexer.has("id") ? {type: "id"} : id), "paren_unary_yes"]},
    {"name": "paren_unary_yes", "symbols": [(lexer.has("unary") ? {type: "unary"} : unary)]},
    {"name": "paren_unary_yes", "symbols": ["assign_op", "init_operands"]},
    {"name": "control", "symbols": [(lexer.has("skip_word") ? {type: "skip_word"} : skip_word), (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "control", "symbols": [(lexer.has("break_word") ? {type: "break_word"} : break_word), (lexer.has("terminator") ? {type: "terminator"} : terminator)]},
    {"name": "return_statement", "symbols": [(lexer.has("return_word") ? {type: "return_word"} : return_word), "assignable_values", (lexer.has("terminator") ? {type: "terminator"} : terminator)]}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
