@{%
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
%}

@lexer lexer

program
  -> statement %EOF

statement
  -> desired_statement statement
  | null

desired_statement
  -> data_declare {%id%}
  | const_declare {%id%}
  | object_declare {%id%}
  | void_declare {%id%}
  | id_assign {%id%}
  | output_statement {%id%}
  | if_statement {%id%}
  | loop_statement {%id%}
  | control {%id%}
  | comments {%id%}
  | trim_function {%id%}
  | type_casting {%id%}
  | size_function {%id%}
  | return_statement {%id%}

id_assign
  -> ids %terminator
  | ids assign_op assignable_values %terminator

assignable_values
  -> input_statement
  | expressions
  | type_casting
  | size_function
  | trim_function
  | array_literal

data_declare
  -> data_id data_choices

data_choices
  -> %assign_only_op assignable_values %terminator
  | function_dec
  | %terminator

data_id
  -> %number_datatype %id
  | %string_datatype %id
  | %boolean_datatype %id
  | %seed_datatype %id

const_declare
  -> const_start %assign_only_op assignable_values %terminator

const_start
  -> %stone_datatype %id

object_declare
  -> object_id object_choice

object_id
  -> %object_datatype %id

object_choice
  -> %terminator
  | %assign_only_op object_wrapper %terminator

object_wrapper
  -> %L_curl object_content %R_curl

object_content
  -> data_id %colon assignable_values append_property
  | null

append_property
  -> %comma object_content
  | null

void_declare
  -> %void_datatype %id function_dec

function_dec
  -> %L_paren dec_content %R_paren block_scope

dec_content
  -> data_id dec_content_append
  | null

dec_content_append
  -> %comma dec_content
  | null

function_call
  -> paren_wrapper

paren_wrapper
  -> %L_paren paren_content %R_paren

paren_content
  -> expressions paren_content_append
  | null

paren_content_append
  -> %comma paren_content
  | null

block_scope
  -> %L_curl statement %R_curl

expressions
  -> operand expression_add

expression_add
  -> operator expressions
  | null

operator
  -> arith_op {%id%}
  | relate_op {%id%}
  | assign_with_op {%id%}
  | logical_op {%id%}

operand
  -> literals {%id%}
  | ids {%id%}
  | type_casting {%id%}
  | trim_function {%id%}
  | size_function {%id%}
  | not_options
  | %L_paren
  | operand %R_paren

not_options
  -> %not_op operand

arith_op
  -> %add_op
  | %subtract_op
  | %multiply_op
  | %divide_op
  | %modulo_op

relate_op
  -> relate_op_num {%id%}
  | relate_op_bool {%id%}

relate_op_num
  -> %greater_than_op
  | %less_than_op
  | %greater_equal_op
  | %less_equal_op

relate_op_bool
  -> %not_equal_op
  | %equal_to_op

assign_op
  -> assign_operators {%id%}
  | %assign_only_op
  | %add_assign_op

assign_with_op
  -> assign_operators {%id%}
  | %add_assign_op

assign_operators
  -> %subtract_assign_op
  | %multiply_assign_op
  | %divide_assign_op
  | %modulo_assign_op

logical_op
  -> %and_op
  | %or_op

literals
  -> number_literals {%id%}
  | %string_lit period_char str_methods
  | %bool_lit

number_literals
  -> whole_numbers {%id%}
  | float_numbers {%id%}

whole_numbers
  -> %num_lit
  | %nega_num_lit

float_numbers
  -> %float_num_lit
  | %nega_float_num_lit

str_methods
  -> atPos_method
  | atChar_method
  | null

period_char
  -> %period
  | null

atPos_method
  -> %atPos_word %L_paren expressions %R_paren

atChar_method
  -> %atChar_word %L_paren expressions %R_paren

ids
  -> %id unary array_access period_char object_access arr_methods str_methods call_function

object_access
  -> ids
  | null

unary
  -> %unary
  | null

call_function
  -> function_call
  | null

array_access
  -> %L_sqr expressions %R_sqr arr_2D
  | null

arr_2D
  -> %L_sqr expressions %R_sqr
  | null

array_literal
  -> %L_sqr array_contents %R_sqr

array_contents
  -> expressions append_element
  | %L_sqr array_contents %R_sqr append_element
  | null

append_element
  -> %comma array_contents
  | null

arr_methods
  -> %absorb %L_paren array_contents %R_paren
  | %insert_word %L_paren %num_lit %comma array_contents %R_paren
  | %uproot %L_paren expressions %R_paren
  | null

typecast_str
  -> %str_typecast %L_paren expressions %R_paren

typecast_num
  -> %num_typecast %L_paren expressions %R_paren

typecast_bol
  -> %bol_typecast %L_paren expressions %R_paren

type_casting
  -> typecast_str
  | typecast_num
  | typecast_bol

trim_function
  -> %trim %L_paren trim_param %comma %num_lit %R_paren %terminator

trim_param
  -> float_numbers
  | ids

input_statement
  -> %water %L_paren input_choices %R_paren

input_choices
  -> ids
  | %string_lit period_char str_methods

output_statement
  -> %carve %L_paren expressions %R_paren %terminator

size_function
  -> %size %L_paren size_function_choices %R_paren

size_function_choices
  -> %string_lit
  | array_literal
  | ids

if_statement
  -> %if_word %L_paren expressions %R_paren block_scope elif_statement else_statement

elif_statement
  -> %elif %L_paren expressions %R_paren block_scope else_statement
  | null

else_statement
  -> %else_word block_scope
  | null

loop_statement
  -> %during %L_paren expressions %R_paren block_scope
  | %cycle %L_paren cycle_condition %R_paren block_scope

cycle_condition
  -> init_loop %terminator cond_loop %terminator paren_unary

init_loop
  -> %number_datatype %id %assign_only_op expressions
  | %id %assign_only_op expressions
  | null

cond_loop
  -> expressions
  | null

paren_unary
  -> %id unary

comments
  -> %comment
  | %multiline

control
  -> %skip_word %terminator
  | %break_word %terminator

return_statement
  -> %return_word assignable_values %terminator