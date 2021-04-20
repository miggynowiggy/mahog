@{%
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
%}

@lexer lexer

program -> statement

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
  | id_use # this is use to refer the variable reassignment statements and the function call statements
  # | null

declare_data -> data_id data_choices

data_id -> %data_type %id

data_choices
  -> %terminator
  | function_dec
  | %assign_only_op data_nonfunction %terminator

data_nonfunction
  -> literals
  | array_literal
  | id_use # use to refer for the function call and the solo ID only

const_declare
  -> const_start %assign_only_op literals %terminator

const_start -> %constant %id

object_declare
  -> object_id object_choice

object_choice
  -> %terminator
  | %assign_only_op object_wrapper %terminator

object_id -> %object %id

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
  -> num_literals
  | %string_lit
  | %bool_lit

num_literals
  -> %nega_float_num_lit
  | %float_num_lit
  | %nega_num_lit
  | %num_lit

# Determines whether the ID token is being used for variable reassignment or for function call
id_use
  -> %id assign_choice

assign_choice
  -> assign_data
  | function_call %terminator
  | null

assign_data
  -> assign_op data_nonfunction %terminator

array_literal
  -> %L_sqr array_contents %R_sqr

array_contents
  -> literals append_element
  | %L_sqr array_contents %R_sqr append_element
  | null

append_element
  -> %comma array_contents
  | null

void_declare -> %void_word %id function_dec

function_dec
  -> paren_wrapper %L_curl statement %R_curl

function_call
  -> paren_wrapper

paren_wrapper -> %L_paren paren_content %R_paren

paren_content
  -> data_nonfunction paren_content_append
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