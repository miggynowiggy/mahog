@{%
  const moo = require("moo");
  //const IndentationLexer = require("moo-indentation-lexer")

  const lexer = moo.compile({
    id: "id",

    string_lit: "stringLit",
    nega_float_num_lit: "negaFloatNumLit",
    float_num_lit: "floatNumLit",
    nega_num_lit: "negaNumLit",
    num_lit: "numLit",
    bool_lit: ["true", "false"],
    null_word: "null",

    seed: "seed",
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

    return_word: "return",

    trim: "trim",
    size: "size",
    absorb: "absorb",
    insert_word: "insert",
    uproot: "uproot",
    atChar_word: "atChar",
    atPos_word: "atPos",

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
  });
%}

@lexer lexer

program
  -> statement

statement
  -> desired_statement statement
  | null

# This is the very crucial part
# Dapat walang ambiguity sa mga production set nito
desired_statement
  -> declare_data
  | const_declare
  | object_declare
  | void_declare
  | return_statement
  | loop_statement
  | if_statement
  | expressions_noid
  | id_use # this is use to refer the variable reassignment statements and the function call statements
  # | null

data_types
  -> %seed
  | %number_datatype
  | %string_datatype
  | %boolean_datatype

declare_data
  -> data_id data_choices

data_id
  -> data_types %id

data_choices
  -> %terminator
  | function_dec
  | %assign_only_op expressions %terminator

operators
  -> relate_op_bool
  | relate_op_num
  | arith_op
  | %or_op
  | %and_op

relate_op_bool
  -> %not_equal_op
  | %equal_to_op

relate_op_num
  -> %greater_than_op
  | %greater_equal_op
  | %less_than_op
  | %less_equal_op

arith_op
  -> %add_op
  | %subtract_op
  | %multiply_op
  | %divide_op
  | %modulo_op

expressions
  -> data_nonfunction expression_yes
  | null

more_not
  -> %not_op more_not
  | null

grouping
  -> bool_operand additional_bool
  | num_operand additional_num

expressions_noid
  -> data_nonfunction_noid expression_yes %terminator

data_nonfunction_noid
  -> literals # use to refer for the function call and the solo ID only
  | %L_paren expressions %R_paren
  | %not_op more_not data_nonfunction

data_nonfunction
  -> literals
  | ids # use to refer for the function call and the solo ID only
  | %L_paren expressions %R_paren
  | %not_op more_not data_nonfunction
  | array_literal

expression_yes
  -> operators expressions
  | null

const_declare
  -> const_start %assign_only_op literals %terminator

const_start
  -> %stone_datatype %id

object_declare
  -> object_id object_choice

object_choice
  -> %terminator
  | %assign_only_op object_wrapper %terminator

object_id
  -> %object_datatype %id

object_wrapper
  -> %L_curl object_content %R_curl

object_content
  -> data_id %colon data_nonfunction append_property
  | null

append_property
  -> %comma object_content
  | null

assign_op
  -> %assign_op
  | %assign_only_op
  | %add_assign_op

literals
  -> num_literals #additional_num
  | %string_lit
  | %bool_lit #additional_bool

num_literals
  -> %nega_float_num_lit
  | %float_num_lit
  | %nega_num_lit
  | %num_lit

# Determines whether the ID token is being used for variable reassignment or for function call
id_use
  -> %id assign_choice %terminator

assign_choice
  -> assign_op expressions
  | function_call
  | expression_yes

#id_options
  #-> data_nonfunction
  #| expression

array_literal
  -> %L_sqr array_contents %R_sqr

array_contents
  -> literals append_element
  | %L_sqr array_contents %R_sqr append_element
  | null

append_element
  -> %comma array_contents
  | null

void_declare
  -> %void_datatype %id function_dec

function_dec
  -> paren_wrapper %L_curl statement %R_curl

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

return_statement
  -> %return_word return_content

return_content
  -> data_nonfunction %terminator
  | paren_wrapper %terminator
  | %terminator


#TODO
# function call should be flexible, if used as a statement, then the terminator should be included
# if to be used as data assignment, then the terminator should not be included

# loops
loop_statement
  -> %during %L_paren bool_expr %R_paren loopstmt_choices
  | %cycle %L_paren cycle_condition %R_paren loopstmt_choices

loopstmt_choices
  -> %L_curl statement %R_curl

cycle_condition
  -> init_loop cond_loop unary_statement

init_loop
  -> data_id %assign_only_op data_nonfunction %terminator
  | null

cond_loop
  -> %bool_lit %terminator
  | %id bool_expr %terminator
  | null

unary_statement
  -> %id %unary

cond_statement
  -> %L_curl statement %R_curl

# if/elif/else statements
else_statement
  -> %else_word cond_statement
  | null

elif_statement
  -> %elif %L_paren bool_expr %R_paren cond_statement elif_statement else_statement
  | null

if_statement
  -> %if_word %L_paren bool_expr %R_paren cond_statement elif_statement else_statement

my_expression
  -> all_strings %period string_methods # NOTE: Put the all_strings and string_methods in the expression
  | size_function
  | type_casting

# string methods
all_strings
  -> %string_lit
  | %id
  # | my_expression

all_nums
  -> %num_lit
  | %id
  # | my_expression

all_datatype
  -> all_strings
  | all_nums

string_methods
  -> %str_access %L_paren all_nums %R_paren
  | %pos_access %L_paren all_strings %R_paren

# size function
size_function
  -> %size %L_paren all_strings %R_paren

# type casting
type_casting
  -> typecast %L_paren all_datatype %R_paren

typecast
  -> %num_typecast
  | %str_typecast
  | %bol_typecast

#expressions
expression
  -> num_expr
  | bool_expr

num_expr
  -> num_operand additional_num
  | %L_paren num_operand additional_num %R_paren

num_operand
  -> ids
  | num_literals
  | num_expr

additional_num
  -> cond_operator num_operand additional_num
  | null

cond_operator
  -> arith_op
  | relate_op_bool
  | relate_op_num

bool_expr
  -> bool_operand additional_bool
  | %L_paren bool_operand additional_bool %R_paren

bool_operand
  -> ids
  | %bool_lit

additional_bool
  -> null
  | bool_op bool_operand additional_bool

bool_op
  -> relate_op_bool
  | %or_op
  | %and_op

#id, array, and object access
ids
  -> %id id_choices

id_choices
  -> arrIndex object_yes
  | %period period_choice
  | function_call

period_choice
  -> obj_prop
  | arr_method_keyword

object_yes
  -> %period obj_prop
  | null

obj_prop
  -> %id arrIndex

arrIndex
  -> null
  | %L_sqr %num_lit %R_sqr arr2D

arr2D
  -> null
  | %L_sqr %num_lit %R_sqr arr2D

arr_method_keyword
  -> %absorb %L_paren arr_method_param %R_paren
  | %insert_word %L_paren num_literals %comma arr_method_param %R_paren
  | %uproot %L_paren %R_paren

arr_method_param
  -> literals
  | array_literal
  | ids