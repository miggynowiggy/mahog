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
  -> statement

statement
  -> desired_statement statement
  | %EOF
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
  | trim_function %terminator
  | type_casting %terminator
  | size_function %terminator
  | return_statement {%id%}

id_assign
  -> ids id_yes

id_yes
  -> %terminator
  | assign_op assignable_values %terminator
  | operator_no_assign mixed_expressions %terminator
  | unary %terminator

assignable_values
  -> assign_val
  | mixed_expressions

assign_val
  -> input_statement
  | array_literal

mixed_expressions
  -> number_literals init_expr_add
  | %string_lit stringlit_choices
  | optional_mixed_nega
#  | %bool_lit init_expr_add
#  | ids mixed_adds
#  | typecast_num init_expr_add
#  | typecast_str stringlit_choices
#  | typecast_bol init_expr_add
#  | trim_function init_expr_add
#  | size_function init_expr_add
#  | %not_op init_expressions
#  | %L_paren mixed_expressions %R_paren mixed_adds

optional_mixed_nega
  -> option_sign optional_expr

optional_expr  
  -> %bool_lit init_expr_add
  | ids mixed_adds
  | typecast_num init_expr_add
  | typecast_str stringlit_choices
  | typecast_bol init_expr_add
  | trim_function init_expr_add
  | size_function init_expr_add
  | %not_op init_expressions
  | %L_paren mixed_expressions %R_paren mixed_adds


stringlit_choices
  -> %period stringlit_choices_methods
  | atPos_method_null_choices

stringlit_choices_methods
  -> atPos_method atPos_method_null_choices
  | atChar_method init_expr_add

atPos_method_null_choices
  -> atChar_expr_add
  | relate_op_bool atChar_operands string_bool_add

string_bool_expr
  -> atChar_operands string_bool_add

string_bool_add
  -> relate_op_bool string_bool_expr 
  | null

mixed_adds
  -> %add_op mixed_expressions
  | %subtract_op init_expressions
  | %multiply_op init_expressions
  | %divide_op init_expressions
  | %modulo_op init_expressions
  | relate_op_num init_expressions
  | relate_op_bool mixed_expressions
  | logical_op init_expressions
  | null

data_declare
  -> data_id

num_choices
  -> %assign_only_op num_values %terminator
  | function_dec
  | %terminator
  | %unary %terminator
  | %add_assign_op init_expressions %terminator
  | assign_operators init_expressions %terminator
  | null

num_values
  -> init_expressions
  | array_literal

str_choices
  -> %assign_only_op str_values %terminator
  | function_dec
  | %terminator
  | null

str_values
  -> assign_val
  | atChar_expressions

data_id
  -> %number_datatype %id num_choices
  | %string_datatype %id str_choices
  | %boolean_datatype %id num_choices

const_declare
  -> const_start %assign_only_op assignable_values %terminator

const_start
  -> %stone_datatype %id

object_declare
  -> object_id object_choice

object_id
  -> %object_datatype %id

object_choice
  -> %assign_only_op object_wrapper %terminator

object_wrapper
  -> %L_curl object_content %R_curl

object_content
  -> %number_datatype %id %colon num_values %comma append_property
  | %string_datatype %id %colon str_values %comma append_property
  | %boolean_datatype %id %colon num_values %comma append_property

append_property
  -> object_content
  | null

void_declare
  -> %void_datatype %id void_dec

void_dec
  -> %L_paren dec_content %R_paren void_block_scope

void_block_scope
  -> %L_curl void_statements %R_curl

void_statements
  -> void_desired_statement void_statements
  | %EOF
  | null

void_desired_statement
  -> data_declare {%id%}
  | const_declare {%id%}
  | object_declare {%id%}
  | void_declare {%id%}
  | id_assign {%id%}
  | output_statement {%id%}
  | if_statement {%id%}
  | loop_statement {%id%}
  | control {%id%}
  | trim_function %terminator
  | type_casting %terminator
  | size_function %terminator
  | void_return_statement {%id%}

void_return_statement
  -> %return_word %terminator

function_dec
  -> %L_paren dec_content %R_paren block_scope

dec_content
  -> data_type_choices %id dec_content_append
  | null

data_type_choices
  -> %string_datatype
  | %number_datatype
  | %boolean_datatype

dec_content_append
  -> %comma dec_content
  | null

function_call
  -> paren_wrapper

paren_wrapper
  -> %L_paren paren_content %R_paren

paren_content
  -> mixed_expressions paren_content_append
  | null

paren_content_append
  -> %comma paren_content
  | null

block_scope
  -> %L_curl statement %R_curl

bool_operand_no_paren
  -> %bool_lit
  | typecast_bol

bool_operator
  -> relate_op {%id%}
  | logical_op {%id%}

operator
  -> arith_op {%id%}
  | relate_op {%id%}
  | assign_with_op {%id%}
  | logical_op {%id%}

operator_no_assign
  -> arith_op {%id%}
  | relate_op {%id%}
  | logical_op {%id%}

init_expressions
-> init_optional_nega init_operands init_expr_add
| atChar_operands1 atChar_init init_expr_add

init_expr_add
-> operator init_expressions
| %unary
| null

init_optional_nega
  -> %nega_sign
  | null

init_operands
-> ids atChar_method_null
| %L_paren init_paren
| init_operands1
| %not_op init_operands

init_paren
  -> init_expressions %R_paren
  | atChar_expressions %R_paren atChar_init

init_operands1
-> number_literals
| typecast_num
| trim_function {%id%}
| size_function {%id%}
| bool_expr_no_paren

atChar_init
  -> %period atChar_method
  | relate_op_bool atChar_operands

index_arith_expressions
  -> index_arith_operand arith_expr_add
  | %nega_num_lit index_arith_expr_add
  | float_numbers index_arith_expr_add

index_arith_expr_add
  -> operator arith_expressions
  | %unary

index_arith_operand
  -> %num_lit
  | option_sign option_negas
 #| typecast_num
 #| trim_function {%id%}
 #| size_function {%id%}
 #| %not_op arith_operand
 #| %L_paren arith_expressions %R_paren
 #| bool_expr_no_paren

arith_expressions
  -> arith_operand arith_expr_add

arith_expr_add
  -> operator arith_expressions
  | %unary
  | null

arith_operand
  -> number_literals {%id%}
  | option_sign option_negas
 #| typecast_num
 #| trim_function {%id%}
 #| size_function {%id%}
 #| %not_op arith_operand
 #| %L_paren arith_expressions %R_paren
 #| bool_expr_no_paren

option_sign
  -> %nega_sign
  | null

option_negas
  -> ids {%id%}
  | %L_paren arith_expressions %R_paren
  | typecast_num
  | trim_function {%id%}
  | size_function {%id%}
  | %not_op arith_operand
  | bool_expr_no_paren


atChar_method_null
  -> %period %atChar_word %L_paren atChar_expressions %R_paren
  | null

bool_expr_no_paren
  -> bool_operand_no_paren bool_expr_add_no_paren

bool_expr_add_no_paren
  -> bool_operator bool_expr_no_paren
  | null

atChar_expressions
-> atChar_operands atPos_method_null atChar_expr_add

str_expressions
  -> str_operand str_expr_add

str_expr_add
  -> str_operator str_expressions
  | null

str_operand
  -> %string_lit additional_str_method
  | ids {%id%}
  | typecast_str
  | %L_paren str_expressions %R_paren

str_operator
  -> arith_op {%id%}

atChar_expr_add
-> str_operator atChar_expressions
| null

atChar_operands
-> ids {%id%}
| %L_paren atChar_expressions %R_paren
| atChar_operands1

atPos_method_null
  -> %period %atPos_word %L_paren index_arith_expressions %R_paren
  | null

atChar_operands1
-> %string_lit
| typecast_str

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
  | %string_lit additional_str_method
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

atPos_method
  -> %atPos_word %L_paren index_arith_expressions %R_paren

atChar_method
  -> %atChar_word %L_paren str_expressions %R_paren

ids
  -> %id id_choices

id_choices
  -> array_access
  | call_function
  | object_access
  | null

object_access
  -> %period object_yes

object_yes
  -> %id object_arr
  | str_methods
  | arr_methods

object_arr
  -> array_access
  | null

unary
  -> %unary

call_function
  -> function_call

array_access
  -> %L_sqr index_arith_expressions %R_sqr arr_2D

arr_2D
  -> %L_sqr index_arith_expressions %R_sqr
  | null

array_literal
  -> %L_sqr array_contents %R_sqr

array_contents
  -> mixed_expressions append_element
  | %L_sqr mixed_expressions append_element_2d_yes %R_sqr append_element
  | null

append_element
  -> %comma array_contents
  | null

append_element_2d_yes
  -> %comma mixed_expressions append_element_2d_yes
  | null

arr_methods
  -> %absorb %L_paren array_contents %R_paren
  | %insert_word %L_paren index_arith_expressions %comma array_contents %R_paren
  | %uproot %L_paren index_arith_expressions %R_paren

typecast_str
  -> %str_typecast %L_paren input_statement_paren %R_paren

typecast_num
  -> %num_typecast %L_paren input_statement_paren %R_paren

typecast_bol
  -> %bol_typecast %L_paren input_statement_paren %R_paren

input_statement_paren
  -> mixed_expressions
  | input_statement

type_casting
  -> typecast_str
  | typecast_num
  | typecast_bol

trim_function
  -> %trim %L_paren init_expressions %comma init_expressions %R_paren

input_statement
  -> %water %L_paren input_choices %R_paren

input_choices
  -> atChar_expressions

additional_str_method
  -> %period str_methods
  | null

output_statement
  -> %carve %L_paren mixed_expressions %R_paren %terminator

size_function
  -> %size %L_paren size_function_choices %R_paren

size_function_choices
  -> size_expressions
  | ids size_id_choices

size_id_choices
  -> atPos_method_null size_expr_add

size_expressions
-> size_operands atPos_method_null size_expr_add

size_expr_add
-> str_operator atChar_expressions
| null

size_operands
-> %L_paren size_expressions %R_paren
| atChar_operands1

if_statement
  -> %if_word %L_paren mixed_expressions %R_paren block_scope elif_statement else_statement

elif_statement
  -> %elif %L_paren mixed_expressions %R_paren block_scope elif_statement
  | null

else_statement
  -> %else_word block_scope
  | null

loop_statement
  -> %during %L_paren mixed_expressions %R_paren block_scope
  | %cycle %L_paren cycle_condition %R_paren block_scope

cycle_condition
  -> init_loop %terminator cond_loop %terminator paren_unary

init_loop
  -> %number_datatype %id %assign_only_op init_expressions
  | %id %assign_only_op init_expressions
  | null

cond_loop
  -> mixed_expressions
  | null

paren_unary
  -> %id paren_unary_yes

paren_unary_yes
-> %unary
| assign_op init_expressions

control
  -> %skip_word %terminator
  | %break_word %terminator

return_statement
  -> %return_word assignable_values %terminator