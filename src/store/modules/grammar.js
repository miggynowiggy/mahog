// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const moo = require("moo");
  let lexer = moo.compile({
    ws: { match: /[\s\t]+/, lineBreaks: true },
    num_lit: /^-?[0-9]{1,9}[|.][0-9]{1,9}/,
    stringLiteral: /["|'].+["|']/,
    boolLiteral: ["true", "true ", "false", "false "],
    comment: /[\\@].+/,
    id: /[a-zA-Z0-9_]{1,25}/,
    dataTypes: ["seed", "seed ", "number", "number ", "string", "string ", "boolean", "boolean "],
    constType: ["stone", "stone "],
    object: ["object", "object "],
    void: ["void", "void "],
    null: "null",
    if: ["if", "if "],
    elif: ["elif", "elseif "],
    else: ["else", "else "],
    water: ["water", "water "],
    carve: ["carve", "carve "],
    cycle: ["cycle", "cycle "],
    during: ["during", "during "],
    control: ["break","break ", "skip", "skip "],
    type_cast: ["num", "num ", "str", "str ", "bol", "bol "],
    return: "return",
    size: ["size", "size "],
    arrFunctions: [".absorb", ".absorb ", ".insert", ".insert ", ".uproot", ".uproot "],
    unary: ["++", "--"],
    assignOp: ["+=", " += ", "-=", " -= ", "*=", " *= ", "%=", " %= ", "/=", " /= ", "=", " = "],
    relationalOp: [">=", " >= ", "<=", " <= ", "!=", " != ", "==", " == "],
    notOp: ["!", "! "],
    logicalOp: ["&&", "||"],
    arithOp: ["+", " + ", "-", " - ", "*", " * ", "%", " % ", "/", " / "],
    "(": "(",
    ")": ")",
    "[": "[",
    "]": "]",
    "{": "{",
    "}": "}",
    ";": ";",
    ".": ".",
    ":": ":"
  });
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "program", "symbols": ["global"]},
    {"name": "program", "symbols": ["statement"]},
    {"name": "global", "symbols": ["global_declare"]},
    {"name": "global", "symbols": ["global"]},
    {"name": "global", "symbols": [{"literal":"null"}]},
    {"name": "global_declare", "symbols": ["const_declare"]},
    {"name": "global_declare", "symbols": ["declare_data"]},
    {"name": "global_declare", "symbols": ["object"]},
    {"name": "const_declare", "symbols": ["const_start", "_", (lexer.has("assign_op") ? {type: "assign_op"} : assign_op), "_", "literals", "_", {"literal":";"}]},
    {"name": "const_declare", "symbols": [{"literal":"null"}]},
    {"name": "const_start", "symbols": [{"literal":"stone"}, "_", (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "data_id", "symbols": [(lexer.has("data_types") ? {type: "data_types"} : data_types), "_", (lexer.has("id") ? {type: "id"} : id)]},
    {"name": "declare_data", "symbols": ["data_id", "_", "data_choices"]},
    {"name": "data_choices", "symbols": [(lexer.has("assign_op") ? {type: "assign_op"} : assign_op), "_", "data_nonfunction", "_", {"literal":";"}]},
    {"name": "data_choices", "symbols": ["function_dec"]},
    {"name": "data_choices", "symbols": [{"literal":";"}]},
    {"name": "data_nonfunction", "symbols": ["array"]},
    {"name": "data_nonfunction", "symbols": ["expressions"]},
    {"name": "data_nonfunction", "symbols": ["variable_dec"]},
    {"name": "variable_dec", "symbols": ["literals"]},
    {"name": "variable_dec", "symbols": ["id_choices"]},
    {"name": "variable_dec", "symbols": ["expressions"]},
    {"name": "expressions", "symbols": ["num_expr"]},
    {"name": "expressions", "symbols": ["bool_expr"]},
    {"name": "expressions", "symbols": ["string_expr"]},
    {"name": "arith_expression", "symbols": ["arith_operand", "_", "additional_arith"]},
    {"name": "arith_expression", "symbols": [{"literal":"("}, "_", "arith_operand", "_", "additional_arith", "_", {"literal":")"}]},
    {"name": "arith_operand", "symbols": ["id_choices"]},
    {"name": "arith_operand", "symbols": ["non_negative_numlit"]},
    {"name": "arith_operand", "symbols": ["arith_expression"]},
    {"name": "additional_arith", "symbols": ["arith_op", "_", "arith_operand", "_", "additional_arith"]},
    {"name": "additional_arith", "symbols": [{"literal":"null"}]},
    {"name": "num_expr", "symbols": ["num_operand", "_", "additional_num"]},
    {"name": "num_expr", "symbols": [{"literal":"("}, "num_operand", "_", "additional_num", {"literal":")"}]},
    {"name": "num_operand", "symbols": ["id_choices"]},
    {"name": "num_operand", "symbols": ["num_literals"]},
    {"name": "num_operand", "symbols": ["positive_float_numlit"]},
    {"name": "num_operand", "symbols": ["negative_float_numlit"]},
    {"name": "num_operand", "symbols": ["num_expr"]},
    {"name": "additional_num", "symbols": ["cond_operator", "_", "num_operand", "_", "additional_num"]},
    {"name": "additional_num", "symbols": [{"literal":"null"}]},
    {"name": "bool_expr", "symbols": ["bool_operand", "_", "additional_bool"]},
    {"name": "bool_expr", "symbols": [{"literal":"("}, "_", "bool_operand", "_", "additional_bool", "_", {"literal":")"}]},
    {"name": "bool_operand", "symbols": ["id_choices"]},
    {"name": "bool_operand", "symbols": ["bool_literal"]},
    {"name": "bool_operand", "symbols": ["bool_expr"]},
    {"name": "bool_operand", "symbols": [(lexer.has("not_op") ? {type: "not_op"} : not_op), "_", "bool_expr"]},
    {"name": "additional_bool", "symbols": ["bool_op", "_", "bool_operand", "_", "additional_bool"]},
    {"name": "additional_bool", "symbols": [{"literal":"null"}]},
    {"name": "bool_op", "symbols": ["relational_bool"]},
    {"name": "bool_op", "symbols": ["logic_op"]},
    {"name": "string_expr", "symbols": ["string_operand", "_", "additional_string"]},
    {"name": "string_expr", "symbols": [{"literal":"("}, "string_operand", "_", "additional_string", {"literal":")"}]},
    {"name": "string_operand", "symbols": ["id_choices", "_", "atchar"]},
    {"name": "string_operand", "symbols": ["str_literal", "_", "atchar"]},
    {"name": "string_operand", "symbols": ["string_expr"]},
    {"name": "additional_string", "symbols": ["string_op", "_", "string_operand", "_", "additional_string"]},
    {"name": "additional_string", "symbols": [{"literal":"null"}]},
    {"name": "string_op", "symbols": [{"literal":"+"}]},
    {"name": "string_op", "symbols": ["relational_bool"]},
    {"name": "string_op", "symbols": ["relational_num"]},
    {"name": "literals", "symbols": ["num_literals"]},
    {"name": "literals", "symbols": ["str_literal"]},
    {"name": "literals", "symbols": ["bool_literal"]},
    {"name": "num_literals", "symbols": ["non_negative_numlit"]},
    {"name": "num_literals", "symbols": ["negative_numlit"]},
    {"name": "num_literals", "symbols": ["negative_float_numlit"]},
    {"name": "num_literals", "symbols": ["positive_float_numlit"]},
    {"name": "non_negative_numlit", "symbols": ["positive_numlit"]},
    {"name": "non_negative_numlit", "symbols": [{"literal":"0"}]},
    {"name": "array", "symbols": [{"literal":"["}, "_", "arr_contents", {"literal":"]"}, "_", "arr_methods"]},
    {"name": "arr_contents", "symbols": [{"literal":"["}, "_", "arr_2D", "_", {"literal":"]"}, "_", "additional_2D_lit"]},
    {"name": "arr_contents", "symbols": ["literals", "_", "additional_lit"]},
    {"name": "arr_contents", "symbols": [{"literal":"null"}]},
    {"name": "arr_2D", "symbols": ["literals", "_", "additional_lit"]},
    {"name": "arr_2D", "symbols": [{"literal":"null"}]},
    {"name": "additional_lit", "symbols": [{"literal":","}, "_", "literals", "_", "additional_lit"]},
    {"name": "additional_lit", "symbols": [{"literal":"null"}]},
    {"name": "additional_2D_lit", "symbols": [{"literal":","}, "_", {"literal":"["}, "_", "arr_2D", "_", {"literal":"]"}, "_", "additional_2D_lit"]},
    {"name": "additional_2D_lit", "symbols": [{"literal":"null"}]},
    {"name": "object_dec", "symbols": [{"literal":"object"}, "_", (lexer.has("id") ? {type: "id"} : id), "_", {"literal":"="}, "_", {"literal":"{"}, "_", "obj_props", "_", {"literal":"}"}, "_", {"literal":";"}]},
    {"name": "obj_props", "symbols": ["data_id", "_", {"literal":":"}, "_", "literals", "_", "additional_props"]},
    {"name": "additional_props", "symbols": [{"literal":","}, "_", "obj_props"]},
    {"name": "additional_props", "symbols": [{"literal":"null"}]},
    {"name": "statement", "symbols": ["desired_statement", "_", "statement"]},
    {"name": "statement", "symbols": [{"literal":"null"}]},
    {"name": "desired_statement", "symbols": ["declare_data"]},
    {"name": "desired_statement", "symbols": ["assign_statement"]},
    {"name": "desired_statement", "symbols": ["input_statement"]},
    {"name": "desired_statement", "symbols": ["output_statements", "_", {"literal":";"}]},
    {"name": "desired_statement", "symbols": ["loop_statement"]},
    {"name": "desired_statement", "symbols": ["if_statement"]},
    {"name": "desired_statement", "symbols": ["iterate_statement"]},
    {"name": "desired_statement", "symbols": ["return_statement"]},
    {"name": "desired_statement", "symbols": ["object_dec"]},
    {"name": "desired_statement", "symbols": ["obj_reassign"]},
    {"name": "desired_statement", "symbols": ["function_call", "_", {"literal":";"}]},
    {"name": "desired_statement", "symbols": ["array", "_", {"literal":";"}]},
    {"name": "desired_statement", "symbols": ["comment"]},
    {"name": "control", "symbols": ["skip", "_", {"literal":";"}]},
    {"name": "control", "symbols": ["break", "_", {"literal":";"}]},
    {"name": "control", "symbols": [{"literal":"null"}]},
    {"name": "if_statement", "symbols": [{"literal":"if"}, "_", {"literal":"("}, "_", "cond_choices", "_", {"literal":")"}, "_", "stmt_choices", "_", "elif_statement", "_", "else_statement"]},
    {"name": "elif_statement", "symbols": [(lexer.has("elif") ? {type: "elif"} : elif), "_", {"literal":"("}, "_", "cond_choices", "_", {"literal":")"}, "_", "stmt_choices", "_", "eliif_statement", "_", "else_statement"]},
    {"name": "elif_statement", "symbols": [{"literal":"null"}]},
    {"name": "else_statement", "symbols": [{"literal":"else"}, "_", "stmt_choices"]},
    {"name": "else_statement", "symbols": [{"literal":"null"}]},
    {"name": "stmt_choices", "symbols": ["desired_statement"]},
    {"name": "stmt_choices", "symbols": [{"literal":"{"}, "_", "statement", "_", {"literal":"}"}]},
    {"name": "cond_choices", "symbols": [{"literal":"!"}, "_", "not_condition", "_", "add_condition"]},
    {"name": "cond_choices", "symbols": ["cond_operand", "_", "add_condition"]},
    {"name": "not_condition", "symbols": ["cond_choices"]},
    {"name": "not_condition", "symbols": [{"literal":"("}, "_", "cond_operand", "_", {"literal":")"}]},
    {"name": "not_condition", "symbols": ["access_expr"]},
    {"name": "not_condition", "symbols": ["bool_literal"]},
    {"name": "add_condition", "symbols": ["cond_operator", "_", "cond_choices"]},
    {"name": "add_condition", "symbols": [{"literal":"null"}]},
    {"name": "cond_operator", "symbols": [(lexer.has("arith_op") ? {type: "arith_op"} : arith_op)]},
    {"name": "cond_operator", "symbols": [(lexer.has("relation_op") ? {type: "relation_op"} : relation_op)]},
    {"name": "cond_operator", "symbols": [(lexer.has("logical_op") ? {type: "logical_op"} : logical_op)]},
    {"name": "cond_operand", "symbols": ["access_expr"]},
    {"name": "cond_operand", "symbols": ["literals"]},
    {"name": "cond_operand", "symbols": [{"literal":"("}, "_", "nested_cond", "_", {"literal":")"}]},
    {"name": "cond_operand", "symbols": ["expressions"]},
    {"name": "nested_cond", "symbols": ["cond_operand"]},
    {"name": "nested_cond", "symbols": ["cond_choices"]},
    {"name": "comment", "symbols": ["_", {"literal":"@"}, "_", "comment_input"]},
    {"name": "comment_input", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)]},
    {"name": "comment_input", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "output", "symbols": [(lexer.has("carve") ? {type: "carve"} : carve), "_", {"literal":"("}, "_", "output_statements", "_", {"literal":")"}, "_", {"literal":";"}]},
    {"name": "output_statements", "symbols": ["access_expr", "_", "additional_access"]},
    {"name": "output_statements", "symbols": [{"literal":"null"}]},
    {"name": "additional_access", "symbols": [{"literal":","}, "_", "access_expr", "_", "additional_access"]},
    {"name": "additional_access", "symbols": [{"literal":"null"}]},
    {"name": "access_expr", "symbols": ["variable_dec"]},
    {"name": "access_expr", "symbols": ["function_call"]},
    {"name": "assign_statement", "symbols": ["numid_stmt"]},
    {"name": "assign_statement", "symbols": ["stringid_stmt"]},
    {"name": "assign_statement", "symbols": ["boolid_stmt"]},
    {"name": "iterate_statement", "symbols": ["id_choices", "_", "unary", "_", {"literal":";"}]},
    {"name": "iterate_statement", "symbols": ["arr_access", "_", "unary", "_", {"literal":";"}]},
    {"name": "iterate_statement", "symbols": ["object_access", "_", "unary", "_", {"literal":";"}]},
    {"name": "input_statement", "symbols": ["data_id", "_", (lexer.has("assign_op") ? {type: "assign_op"} : assign_op), "_", (lexer.has("water") ? {type: "water"} : water), "_", {"literal":"("}, "_", "variable_dec", "_", {"literal":")"}, "_", {"literal":";"}]},
    {"name": "loop_statement", "symbols": [(lexer.has("cycle") ? {type: "cycle"} : cycle), "_", {"literal":"("}, "_", "for_init", "_", {"literal":";"}, "_", "cond_choices", "_", {"literal":";"}, "_", "iterate_statement", "_", {"literal":")"}, "_", "loopstmt_choices"]},
    {"name": "loop_statement", "symbols": [(lexer.has("during") ? {type: "during"} : during), "_", {"literal":"("}, "_", "cond_choices", "_", {"literal":")"}, "_", "loopstmt_choices"]},
    {"name": "loopstmt_choices", "symbols": ["_", {"literal":"{"}, "_", "statement", "_", "control", "_", "statement", "_", {"literal":"}"}]},
    {"name": "loopstmt_choices", "symbols": ["desired_statement"]},
    {"name": "loopstmt_choices", "symbols": [{"literal":";"}]},
    {"name": "for_init", "symbols": ["data_id", "_", (lexer.has("assign_op") ? {type: "assign_op"} : assign_op), "_", "num_literals"]},
    {"name": "for_init", "symbols": ["id", (lexer.has("assign_op") ? {type: "assign_op"} : assign_op), "_", "num_literals"]},
    {"name": "for_init", "symbols": [{"literal":"null"}]},
    {"name": "declare_void", "symbols": [{"literal":"void"}, "_", (lexer.has("id") ? {type: "id"} : id), "_", "void_body"]},
    {"name": "void_body", "symbols": ["_", {"literal":"("}, "_", "param", "_", {"literal":")"}, "_", "void_choices"]},
    {"name": "function_dec", "symbols": ["_", {"literal":"("}, "_", "param", "_", {"literal":")"}, "_", "funcstmt_choices"]},
    {"name": "param", "symbols": ["data_id", "_", "add_param"]},
    {"name": "param", "symbols": ["literals", "_", "add_param"]},
    {"name": "param", "symbols": ["data_types", "_", {"literal":"["}, "_", {"literal":"]"}, "_", "twoD_array", "_", (lexer.has("id") ? {type: "id"} : id), "_", "add_param"]},
    {"name": "param", "symbols": [{"literal":"null"}]},
    {"name": "twoD_array", "symbols": [{"literal":"["}, "_", {"literal":"]"}]},
    {"name": "twoD_array", "symbols": [{"literal":"null"}]},
    {"name": "add_param", "symbols": [{"literal":","}, "_", "param"]},
    {"name": "add_param", "symbols": [{"literal":"null"}]},
    {"name": "funcstmt_choices", "symbols": ["return_statement"]},
    {"name": "funcstmt_choices", "symbols": [{"literal":"{"}, "_", "statement", "_", "return_statement", "_", {"literal":"}"}]},
    {"name": "void_choices", "symbols": ["desired_statement"]},
    {"name": "void_choices", "symbols": ["void_return"]},
    {"name": "void_choices", "symbols": [{"literal":"{"}, "_", "statement", "_", "void_return", "_", {"literal":"}"}]},
    {"name": "void_return", "symbols": [{"literal":"return;"}]},
    {"name": "function_call", "symbols": [(lexer.has("id") ? {type: "id"} : id), "_", {"literal":"("}, "_", "call_params", "_", {"literal":")"}]},
    {"name": "call_params", "symbols": ["access_expr", "_", "addcall_params"]},
    {"name": "call_params", "symbols": ["array", "_", "addcall_params"]},
    {"name": "call_params", "symbols": [{"literal":"null"}]},
    {"name": "addcall_params", "symbols": [{"literal":","}, "_", "call_params"]},
    {"name": "addcall_params", "symbols": [{"literal":"null"}]},
    {"name": "obj_reassign", "symbols": ["object_access", "_", "obj_assop", "_", {"literal":";"}]},
    {"name": "obj_assop", "symbols": ["assign_op", "_", "data_nonfunction"]},
    {"name": "obj_assop", "symbols": ["unary"]},
    {"name": "objprop_access", "symbols": [(lexer.has("id") ? {type: "id"} : id)]},
    {"name": "objprop_access", "symbols": ["arr_access"]},
    {"name": "object_access", "symbols": [(lexer.has("id") ? {type: "id"} : id), "_", {"literal":"."}, "_", "objprop_access"]},
    {"name": "object_access", "symbols": ["arr_access", "_", {"literal":"."}, "_", "objprop_access"]},
    {"name": "arr_access", "symbols": [(lexer.has("id") ? {type: "id"} : id), "_", {"literal":"["}, "_", "arr_index", "_", {"literal":"]"}, "_", "add_arr_access"]},
    {"name": "arr_access", "symbols": ["object_access", "_", {"literal":"["}, "_", "arr_index", "_", {"literal":"]"}, "_", "add_arr_access"]},
    {"name": "add_arr_access", "symbols": [{"literal":"["}, "_", "arr_index", "_", {"literal":"]"}]},
    {"name": "add_arr_access", "symbols": [{"literal":"null"}]},
    {"name": "arr_index", "symbols": ["non_negative_numlit"]},
    {"name": "arr_index", "symbols": ["arith_expression"]},
    {"name": "return_values", "symbols": ["access_expr"]},
    {"name": "return_values", "symbols": [{"literal":"null"}]},
    {"name": "return_statement", "symbols": [{"literal":"return"}, "_", "return_values", "_", {"literal":";"}]},
    {"name": "return_statement", "symbols": ["void_return"]},
    {"name": "relate_op", "symbols": ["relational_bool"]},
    {"name": "relate_op", "symbols": ["relational_num"]},
    {"name": "relational_bool", "symbols": [{"literal":"=="}]},
    {"name": "relational_bool", "symbols": [{"literal":"!="}]},
    {"name": "relational_num", "symbols": [{"literal":">"}]},
    {"name": "relational_num", "symbols": [{"literal":"<"}]},
    {"name": "relational_num", "symbols": [{"literal":">="}]},
    {"name": "relational_num", "symbols": [{"literal":"<="}]},
    {"name": "numid_stmt", "symbols": ["id_choices", "_", "numid_op", "_", "num_expr", "_", {"literal":";"}]},
    {"name": "numid_stmt", "symbols": ["iterate_statement"]},
    {"name": "numid_op", "symbols": [{"literal":"="}]},
    {"name": "numid_op", "symbols": ["cond_operator"]},
    {"name": "stringid_stmt", "symbols": ["id_choices", "_", "stringid_op", "_", "string_expr", "_", {"literal":";"}]},
    {"name": "stringid_op", "symbols": [{"literal":"="}]},
    {"name": "boolid_stmt", "symbols": [{"literal":"+="}]},
    {"name": "boolid_stmt", "symbols": ["id_choices", "_", {"literal":"="}, "_", "bool_expr", "_", {"literal":";"}]},
    {"name": "id_choices", "symbols": [(lexer.has("id") ? {type: "id"} : id)]},
    {"name": "id_choices", "symbols": ["arr_access"]},
    {"name": "id_choices", "symbols": ["object_access"]},
    {"name": "type_cast", "symbols": [(lexer.has("type_cast") ? {type: "type_cast"} : type_cast), "_", {"literal":"("}, "_", "type_cast_params", "_", {"literal":")"}, "_", {"literal":";"}]},
    {"name": "type_cast_params", "symbols": ["function_call"]},
    {"name": "type_cast_params", "symbols": ["literals"]},
    {"name": "type_cast_params", "symbols": ["expressions"]},
    {"name": "type_cast_params", "symbols": ["id_choices"]},
    {"name": "size_func", "symbols": [(lexer.has("size") ? {type: "size"} : size), "_", {"literal":"("}, "_", "size_params", "_", {"literal":")"}, "_", {"literal":";"}]},
    {"name": "size_params", "symbols": ["array"]},
    {"name": "size_params", "symbols": ["id_choices"]},
    {"name": "size_params", "symbols": ["string_expr"]},
    {"name": "size_params", "symbols": ["function_call"]},
    {"name": "size_params", "symbols": ["str_literal"]},
    {"name": "size_params", "symbols": [{"literal":"null"}]},
    {"name": "arr_methods", "symbols": [{"literal":".absorb"}, "_", {"literal":"("}, "_", "access_expr", "_", {"literal":")"}]},
    {"name": "arr_methods", "symbols": [{"literal":".insert"}, "_", {"literal":"("}, "_", "arith_expression", "_", {"literal":","}, "_", "access_expr", {"literal":")"}]},
    {"name": "arr_methods", "symbols": [{"literal":".uproot"}, "_", {"literal":"("}, "_", "access_expr", "_", {"literal":")"}]},
    {"name": "arr_methods", "symbols": [{"literal":"null"}]},
    {"name": "atchar", "symbols": [{"literal":".atChar"}, "_", {"literal":"("}, "_", "access_expr", "_", {"literal":")"}, "_", {"literal":";"}]},
    {"name": "atchar", "symbols": [{"literal":"null"}]},
    {"name": "trim_func", "symbols": [{"literal":"trim"}, "_", {"literal":"("}, "_", "access_expr", "_", {"literal":")"}, "_", {"literal":";"}]},
    {"name": "trim_func", "symbols": [{"literal":"null"}]}
]
  , ParserStart: "_"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
