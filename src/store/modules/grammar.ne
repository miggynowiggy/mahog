@{%
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
%}

@lexer lexer

_ -> %ws

program -> global | statement

global -> global_declare
  | global
  | "null"

global_declare
  -> const_declare
  | declare_data
  | object

const_declare -> const_start _ %assign_op _ literals _ ";" | "null"

const_start -> "stone" _ %id

data_id -> %data_types _ %id

declare_data -> data_id _ data_choices

data_choices
  -> %assign_op _ data_nonfunction _ ";"
  | function_dec
  | ";"

data_nonfunction
  -> array
  | expressions
  | variable_dec

variable_dec
  -> literals
  | id_choices
  | expressions

expressions
  -> num_expr
  | bool_expr
  | string_expr

arith_expression
  -> arith_operand _ additional_arith
  | "(" _ arith_operand _ additional_arith _ ")"

arith_operand
  -> id_choices
  | non_negative_numlit
  | arith_expression

additional_arith
  -> arith_op _ arith_operand _ additional_arith
  | "null"

num_expr
  -> num_operand _ additional_num
  | "(" num_operand _ additional_num ")"

num_operand
  -> id_choices
  | num_literals
  | positive_float_numlit
  | negative_float_numlit
  | num_expr

additional_num
  -> cond_operator _ num_operand _ additional_num
  | "null"

bool_expr
  -> bool_operand _ additional_bool
  | "(" _ bool_operand _ additional_bool _ ")"

bool_operand
  -> id_choices
  | bool_literal
  | bool_expr
  | %not_op _ bool_expr

additional_bool
  -> bool_op _ bool_operand _ additional_bool
  | "null"

bool_op
  -> relational_bool
  | logic_op

string_expr
  -> string_operand _ additional_string
  | "(" string_operand _ additional_string ")"

string_operand
  -> id_choices _ atchar
  | str_literal _ atchar
  | string_expr

additional_string
  -> string_op _ string_operand _ additional_string
  | "null"

string_op
  -> "+"
  | relational_bool
  | relational_num

literals
  -> num_literals
  | str_literal
  | bool_literal

num_literals
  -> non_negative_numlit
  | negative_numlit
  | negative_float_numlit
  | positive_float_numlit

non_negative_numlit
  -> positive_numlit
  | "0"

array -> "[" _ arr_contents "]" _ arr_methods

arr_contents
  -> "[" _ arr_2D _ "]" _ additional_2D_lit
  | literals _ additional_lit
  | "null"

arr_2D
  -> literals _ additional_lit
  | "null"

additional_lit
  -> "," _ literals _ additional_lit
  | "null"

additional_2D_lit
  ->"," _ "[" _ arr_2D _ "]" _ additional_2D_lit
  | "null"

object_dec
  -> "object" _ %id _ "=" _ "{" _ obj_props _ "}" _ ";"

obj_props
  -> data_id _ ":" _ literals _ additional_props

additional_props
  -> "," _ obj_props
  | "null"


statement
  -> desired_statement _ statement
  | "null"

desired_statement
  -> declare_data
  | assign_statement
  | input_statement
  | output_statements _ ";"
  | loop_statement
  | if_statement
  | iterate_statement
  | return_statement
  | object_dec
  | obj_reassign
  | function_call _ ";"
  | array _ ";"
  | comment

control
  -> skip _ ";"
  | break _ ";"
  | "null"

if_statement -> "if" _ "(" _ cond_choices _ ")" _ stmt_choices _ elif_statement _ else_statement

elif_statement
  -> %elif _ "(" _ cond_choices _ ")" _ stmt_choices _ eliif_statement _ else_statement
  | "null"

else_statement
  -> "else" _ stmt_choices
  | "null"

stmt_choices
  -> desired_statement
  | "{" _ statement _ "}"

cond_choices
  -> "!" _ not_condition _ add_condition
  | cond_operand _ add_condition

not_condition
  -> cond_choices
  | "(" _ cond_operand _ ")"
  | access_expr
  | bool_literal

add_condition
  -> cond_operator _ cond_choices
  | "null"

cond_operator
  -> %arith_op
  | %relation_op
  | %logical_op

cond_operand
  -> access_expr
  | literals
  | "(" _ nested_cond _ ")"
  | expressions

nested_cond
  -> cond_operand
  | cond_choices

comment -> _ "@" _ comment_input

comment_input
  -> %string_literal
  | %ws

output -> %carve _ "(" _ output_statements _ ")" _ ";"

output_statements
  -> access_expr _ additional_access
  | "null"

additional_access
  ->"," _ access_expr _ additional_access
  | "null"

access_expr
  -> variable_dec
  | function_call

assign_statement
  -> numid_stmt
  | stringid_stmt
  | boolid_stmt

iterate_statement
  -> id_choices _ unary _ ";"
  | arr_access _ unary _ ";"
  | object_access _ unary _ ";"

input_statement -> data_id _ %assign_op _ %water _ "(" _ variable_dec _ ")" _ ";"

loop_statement
  -> %cycle _ "(" _ for_init _ ";" _ cond_choices _ ";" _ iterate_statement _ ")" _ loopstmt_choices
  | %during _ "(" _ cond_choices _ ")" _ loopstmt_choices

loopstmt_choices
  -> _ "{" _ statement _ control _ statement _ "}"
  | desired_statement
  | ";"

for_init
  -> data_id _ %assign_op _ num_literals
  | id %assign_op _ num_literals
  | "null"

declare_void -> "void" _ %id _ void_body

void_body -> _ "(" _ param _ ")" _ void_choices

function_dec -> _ "(" _ param _ ")" _ funcstmt_choices

param
  -> data_id _ add_param
  | literals _ add_param
  | data_types _ "[" _ "]" _ twoD_array _ %id _ add_param
  | "null"

twoD_array
  -> "[" _ "]"
  | "null"

add_param
  -> "," _ param
  | "null"

funcstmt_choices
  -> return_statement
  | "{" _ statement _ return_statement _ "}"

void_choices
  -> desired_statement
  | void_return
  | "{" _ statement _ void_return _ "}"

void_return
  -> "return;"

function_call -> %id _ "(" _ call_params _ ")"

call_params
  -> access_expr _ addcall_params
  | array _ addcall_params
  | "null"

addcall_params
  -> "," _ call_params
  | "null"

obj_reassign -> object_access _ obj_assop _ ";"

obj_assop
  -> assign_op _ data_nonfunction
  | unary

objprop_access
  -> %id
  | arr_access

object_access
  -> %id _ "." _ objprop_access
  | arr_access _ "." _ objprop_access

arr_access
  -> %id _ "[" _ arr_index _ "]" _ add_arr_access
  | object_access _ "[" _ arr_index _ "]" _ add_arr_access

add_arr_access
  -> "[" _ arr_index _ "]"
  | "null"

arr_index
  -> non_negative_numlit
  | arith_expression

return_values
  -> access_expr
  | "null"

return_statement
  -> "return" _ return_values _ ";"
  | void_return

relate_op
  -> relational_bool
  | relational_num

relational_bool
  -> "=="
  | "!="

relational_num
  -> ">"
  | "<"
  | ">="
  | "<="

numid_stmt
  -> id_choices _ numid_op _ num_expr _ ";"
  | iterate_statement

numid_op
  -> "="
  | cond_operator

stringid_stmt -> id_choices _ stringid_op _ string_expr _ ";"

stringid_op -> "="

boolid_stmt -> "+="
  | id_choices _ "=" _ bool_expr _ ";"

id_choices
  -> %id
  | arr_access
  | object_access

type_cast -> %type_cast _ "(" _ type_cast_params _ ")" _ ";"
type_cast_params
  -> function_call
  | literals
  | expressions
  | id_choices

size_func -> %size _ "(" _ size_params _ ")" _ ";"
size_params
  -> array
  | id_choices
  | string_expr
  | function_call
  | str_literal
  | "null"

arr_methods
  -> ".absorb" _ "(" _ access_expr _ ")"
  | ".insert" _ "(" _ arith_expression _ "," _ access_expr ")"
  | ".uproot" _ "(" _ access_expr _ ")"
  | "null"

atchar -> ".atChar" _ "(" _ access_expr _ ")" _ ";" | "null"

trim_func -> "trim" _ "(" _ access_expr _ ")" _ ";" | "null"