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
  });
%}

@lexer lexer

program
  -> statement

statement
  -> desired_statement statement
  | null

desired_statement
  -> data_declare
  | const_declare
  | object_declare
  | void_declare
  | id_use
  | return_statement
  | loop_statement
  | if_statement
  # | expression_noid
  | input_statement
  | output_statement
  | control
  | trim_function
  | comments

comments
  -> %comment
  | %multiline

control
  -> %skip_word %terminator
  | %break_word %terminator

data_declare
  -> seed_dec
  | num_dec
  | str_dec
  | bool_dec

data_id
  -> %number_datatype %id
  | %string_datatype %id
  | %boolean %id

seed_dec
  -> %seed %id data_choices

data_choices
  -> %terminator
  | function_dec
  | %assign_only_op expressions %terminator

num_dec
  -> %number_datatype %id num_choices

num_choices
  -> %terminator
  | function_dec
  | assign_op num_expr %terminator

str_dec
  -> %string_datatype %id str_choices

str_choices
  -> %terminator
  | function_dec
  | str_assign str_expr %terminator

str_assign
  -> %assign_only_op
  | %add_assign_op

bool_dec
  -> %boolean_datatype %id bool_choices

bool_choices
  -> %terminator
  | function_dec
  | %assign_only_op bool_expr %terminator

operators
  -> relate_op_bool
  | relate_op_num
  | arith_op
  | %add_op
  | %or_op
  | %and_op

expressions
  -> data_nonfunction expression_yes
  | null

more_not
  -> %not_op more_not
  | null

expression_noid
  -> data_nonfunction_noid expression_yes

data_nonfunction_noid
  -> num_literals
  | %bool_lit
  | %string_lit methods_yes
  | %L_paren dType_expr
  | %not_op more_not bool_expr
  | size_function
  | type_casting
  | array_literal

data_nonfunction
  -> num_literals
  | %bool_lit
  | %string_lit methods_yes
  | ids methods_yes
  | %L_paren dType_expr
  | size_function
  | type_casting
  | array_literal

dType_expr
  -> num_expr %R_paren
  | bool_expr %R_paren
  | str_expr %R_paren methods_yes

expression_yes
  -> operators expressions
  | null

const_declare
  -> const_start %assign_only_op expressions %terminator

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
  -> data_id %colon data_nonfunction append_property
  | null

append_property
  -> %comma object_content
  | null

assign_op
  -> assign_operators
  | %assign_only_op
  | %add_assign_op

assign_operators
  -> %subtract_assign_op
  | %multiply_assign_op
  | %divide_assign_op
  | %modulo_assign_op

literals
  -> num_literals
  | %string_lit
  | %bool_lit

num_literals
  -> float_numbers
  | %num_lit
  | %nega_num_lit

float_numbers
  -> %float_num_lit
  | %nega_float_num_lit

id_use
  -> %id idOnly_choices %terminator

idOnly_choices
  -> idAssign_choices
  | idFunc_call
  | arr_methods

idAssign_choices
  -> assign_choice
  | %L_sqr %R_sqr idAssign_choices2

idAssign_choices2
  -> assign_choice
  | %L_sqr %R_sqr idAssign_choices3
  | arr_methods

idAssign_choices3
  -> assign_choice
  | %period %id idAssign_choices4

idAssign_choices4
  -> assign_choice
  | arr_methods
  | %L_sqr %R_sqr idAssign_choices5

idAssign_choices5
  -> assign_choice
  | arr_methods
  | %L_sqr %R_sqr idAssign_choices6

idAssign_choices6
  -> assign_choice

assign_choice
  -> assign_op assign_op_choices
  | expression_yes
  | unary

assign_op_choices
  -> expressions
  | input_statement

idFunc_call
  -> function_call

array_literal
  -> %L_sqr array_contents %R_sqr

array_contents
  -> expressions append_element
  | %L_sqr array_contents %R_sqr append_element
  | null

append_element
  -> %comma array_contents
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

relate_op_num
  -> %greater_than_op
  | %less_than_op
  | %greater_equal_op
  | %less_equal_op

relate_op_bool
  -> %not_equal_op
  | %equal_to_op

unary
  -> %unary

relate_op
  -> relate_op_num
  | relate_op_bool

loop_statement
  -> %during %L_paren bool_expr %R_paren block_scope
  | %cycle %L_paren cycle_condition %R_paren block_scope

block_scope
  -> %L_curl statement %R_curl

cycle_condition
  -> init_loop %terminator cond_loop %terminator paren_unary

init_loop
  -> %number_datatype %id %assign_only_op num_expr
  | %id %assign_only_op num_expr
  | null

cond_loop
  -> bool_expr
  | null

unary_statement
  -> %id unary

paren_unary
  -> %id unary

if_statement
  -> %if_word %L_paren bool_expr %R_paren block_scope elif_statement else_statement

elif_statement
  -> %elif %L_paren bool_expr %R_paren block_scope else_statement
  | null

else_statement
  -> %else_word block_scope
  | null

my_expresion_str
  -> all_strings %period atChar_method
  | typecast_str

my_expresion_num
  -> all_strings %period atPos_method
  | size_function
  | typecast_num

all_strings
  -> %string_lit
  | %id
  | my_expresion_str
  | %L_paren str_expr %R_paren

all_nums
  -> %num_lit
  | %id
  | my_expresion_num

methods_yes
  -> atChar_yes
  | atPos_yes

atChar_yes
  -> %period atChar_method
  | null

atPos_yes
  -> %period atPos_method
  | null

all_datatype
  -> all_strings
  | all_nums

typecast_str
  -> %str_typecast %L_paren all_nums %R_paren

typecast_num
  -> %num_typecast %L_paren all_strings %R_paren

typecast_bol
  -> %bol_typecast %L_paren all_datatype %R_paren

atChar_method
  -> %atChar_word %L_paren all_nums %R_paren

atPos_method
  -> %atPos_word %L_paren all_strings %R_paren

type_casting
  -> typecast_str
  | typecast_num
  | typecast_bol

num_expr
  -> num_operand additional_num
  | null

num_operand
  -> num_literals
  | size_function
  | typecast_num
  | array_literal
  | ids atPos_yes
  | %string_lit %period %atPos_word %L_paren str_expr %R_paren
  | %L_paren numParen_expr

numParen_expr
  -> num_expr %R_paren
  | str_expr %R_paren %period %atPos_word %L_paren str_expr %R_paren

additional_num
  -> cond_operator num_expr
  | null

cond_operator
  -> arith_op
  | %add_op
  | relate_op

whl_num_expr
  -> whl_num_operand additional_whl_num

whl_num_operand
  -> ids atPos_yes
  | %string_lit %period %atPos_word %L_paren str_expr %R_paren
  | %num_lit
  | %L_paren whl_numParen_expr
  | size_function
  | typecast_num

whl_numParen_expr
  -> whl_num_expr %R_paren
  | str_expr %R_paren %period %atPos_word %L_paren str_expr %R_paren

additional_whl_num
  -> cond_operator whl_num_expr

bool_expr
  -> bool_operand additional_bool
  | null

bool_operand
  -> ids
  | literals
  | array_literal
  | %L_paren bool_expr %R_paren
  | %not_op more_not bool_expr
  | typecast_bol

additional_bool
  -> bool_op bool_expr
  | null

bool_op
  -> relate_op_bool
  | %or_op
  | %and_op

str_op
  -> %add_op
  | relate_op

str_expr
  -> str_operand additional_str
  | null

str_operand
  -> ids atChar_yes
  | array_literal
  | %string_lit atChar_yes
  | %L_paren str_expr %R_paren atChar_yes
  | %str_typecast %L_paren num_expr %R_paren atChar_yes

additional_str
  -> null
  | str_op str_expr

ids
  -> %id fullId_choices

fullId_choices
  -> id_choices
  | withFunc

noFunc_ids
  -> %id id_choices

id_choices
  -> arrIndex object_yes
  | %period obj_prop

withFunc
  -> function_call

object_yes
  -> %period obj_prop
  | null

obj_prop
  -> %id arrIndex

arrIndex
  -> %L_sqr whl_num_expr %R_sqr arr2D
  | null

arr2D
  -> %L_sqr whl_num_expr %R_sqr arr2D
  | null

arr_methods
  -> %period %absorb %L_paren expressions %R_paren
  | %period %insert_word %L_paren %num_lit %comma expressions %R_paren
  | %period %uproot %L_paren %num_lit %R_paren

arith_op
  -> %add_op
  | %subtract_op
  | %multiply_op
  | %divide_op
  | %modulo_op

return_statement
  -> %return_word return_choices %terminator

return_choices
  -> expressions
  | expression_noid
  | size_function
  | type_casting
  | id_use
  | ids
  | literals
  | trim_function

trim_function
  -> %trim %L_paren trim_param %comma range_param %R_paren %terminator

trim_param
  -> float_numbers
  | %id

range_param
  -> %num_lit

input_statement
  -> data_id %assign_only_op %water %L_paren input_choices %R_paren %terminator

input_choices
  -> str_expr
  | %id

output_statement
  -> %carve %L_paren output_choice %R_paren %terminator

output_choice
  -> literals
  | expressions
  | expression_noid
  | size_function
  | trim_function
  | type_casting
  | id_use
  | ids

size_function
  -> %size %L_paren size_function_choices %R_paren

size_function_choices
  -> %string_lit
  | array_literal
  | ids
