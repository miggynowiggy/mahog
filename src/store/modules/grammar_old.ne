program -> global {% id %}

global
  -> const_declare
  | declare_data
  | object_dec
  | statement

declare_data -> data_id data_choices

data_id -> "<dataTypes>" "<id>"

data_choices
  -> "<assignOp>" data_nonfunction "<terminator>"
  | function_dec
  | "<terminator>" {% id %}
  | null

data_nonfunction
  -> array
  | expressions
  | literals
  | id_choice

const_declare
  -> const_start "<assignOp>" literals "<terminator>"
  | null

const_start -> "<constType>" "<id>"

variable_dec
  -> literals
  | id_choices
  | expressions

expressions
  -> num_expr
  | bool_expr
  | string_expr

arith_expression
  -> arith_operand additional_arith
  | "<LParen>" arith_operand additional_arith "<RParen>"

arith_operand
  -> id_choices
  | non_negative_numlit
  | arith_expression

additional_arith
  -> "<arithOp>" arith_operand additional_arith
  | null

num_expr
  -> num_operand additional_num
  | "<LParen>" num_operand additional_num "<RParen>"

num_operand
  -> id_choices
  | num_literals
  | "<posFlotLit>"
  | "<negaFloatLit>"
  | num_expr

additional_num
  -> cond_operator num_operand additional_num
  | null

bool_expr
  -> bool_operand additional_bool
  | "<LParen>" bool_operand additional_bool "<RParen>"

bool_operand
  -> id_choices
  | "<boolLit>" {% id %}
  | bool_expr
  | "<notOp>" bool_expr

additional_bool
  -> bool_op bool_operand additional_bool
  | null

bool_op
  -> relate_op
  | "<logicOp>" {%id%}

string_expr
  -> string_operand additional_string
  | "<LParen>" string_operand additional_string "<RParen>"

string_operand
  -> id_choices atchar
  | "<stringLit>" atchar
  | string_expr

additional_string
  -> string_op string_operand additional_string
  | null

string_op
  -> "<addOp>" {% id %}
  | "<addAssignOp>" {% id %}
  | relate_op

literals
  -> num_literals
  | "<stringLit>" {% id %}
  | "<boolLit>" {% id %}

num_literals
  -> "<negaFloatLit>"
  | "<posFloatLit>"
  | "<nonNegaNumLit>"
  | "<negaNumLit>"

non_negative_numlit
  -> "<nonNegaNumLit>"

array -> "<LSqr>" arr_contents "<RSqr>" arr_methods

arr_contents
  -> "<LSqr>" arr_2D "<RSqr>" additional_2D_lit
  | literals additional_lit
  | null

arr_2D
  -> literals additional_lit
  | null

additional_lit
  -> "<comma>" literals additional_lit
  | null

additional_2D_lit
  ->"<comma>" "<LSqr>" arr_2D "<RSqr>" additional_2D_lit
  | null

object_dec
  -> "<obj>" "<id>" "<assignOp>" "<LCurl>" obj_props "<RCurl>" "<terminator>"

obj_props
  -> data_id "<colon>" literals additional_props

additional_props
  -> "<comma>" obj_props
  | null


statement
  -> desired_statement statement
  | null

desired_statement
  -> declare_data
  | assign_statement
  | input_statement
  | output_statements "<terminator>"
  | loop_statement
  | if_statement
  | iterate_statement
  | return_statement
  | object_dec
  | obj_reassign
  | function_call "<terminator>"
  | array "<terminator>"
  | comment

control
  -> "<control>" "<terminator>"
  | null

if_statement -> "<ifState>" "<LParen>" cond_choices "<RParen>" stmt_choices elif_statement else_statement

elif_statement
  -> "<elifState>" "<LParen>" cond_choices "<RParen>" stmt_choices elif_statement else_statement
  | null

else_statement
  -> "<elseState>" stmt_choices
  | null

stmt_choices
  -> desired_statement
  | "<LCurl>" statement "<RCurl>"

cond_choices
  -> "<notOp>" not_condition add_condition
  | cond_operand add_condition

not_condition
  -> cond_choices
  | "<LParen>" cond_operand "<RParen>"
  | access_expr
  | "<boolLit>"

add_condition
  -> cond_operator cond_choices
  | null

cond_operator
  -> "<arithOp>"
  | "<addOp>"
  | "<relateOp>"
  | "<andOp>"
  | "<orOp>"

cond_operand
  -> access_expr
  | literals
  | "<LParen>" nested_cond "<RParen>"
  | expressions

nested_cond
  -> cond_operand
  | cond_choices

comment -> "<comment>"

output -> "<carve>" "<LParen>" output_statements "<RParen>" "<terminator>"

output_statements
  -> access_expr additional_access
  | null

additional_access
  ->"<comma>" access_expr additional_access
  | null

access_expr
  -> variable_dec
  | function_call

assign_statement
  -> numid_stmt
  | stringid_stmt
  | boolid_stmt

iterate_statement
  -> id_choices "<unary>" "<terminator>"
  | arr_access "<unary>" "<terminator>"
  | object_access "<unary>" "<terminator>"

input_statement -> data_id "<assignOp>" "<water>" "<LParen>" variable_dec "<RParen>" "<terminator>"

loop_statement
  -> "<cycle>" "<LParen>" for_init "<terminator>" cond_choices "<terminator>" iterate_statement "<RParen>" loopstmt_choices
  | "<during>" "<LParen>" cond_choices "<RParen>" loopstmt_choices

loopstmt_choices
  -> "<LCurl>" statement control statement "<RParen>"
  | desired_statement
  | "<terminator>"

for_init
  -> data_id "<assignOp>" num_literals
  | "<id>" "<assignOp>" num_literals
  | null

declare_void -> "<voidFunc>" "<id>" void_body

void_body -> "<LParen>" param "<RParen>" void_choices

function_dec -> "<LParen>" param "<RParen>" funcstmt_choices

param
  -> data_id add_param
  | literals add_param
  | "<dataTypes>" "<LSqr>" "<RSqr>" twoD_array "<id>" add_param
  | null

twoD_array
  -> "<LSqr>" "<RSqr>"
  | null

add_param
  -> "<comma>" param
  | null

funcstmt_choices
  -> return_statement
  | "<LCurl>" statement return_statement "<RCurl>"

void_choices
  -> desired_statement
  | void_return
  | "<LCurl>" statement void_return "<RCurl>"

void_return
  -> "<returnState>" "<terminator>"

function_call -> "<id>" "<LParen>" call_params "<RParen>"

call_params
  -> access_expr addcall_params
  | array addcall_params
  | null

addcall_params
  -> "<comma>" call_params
  | null

obj_reassign -> object_access obj_assop "<terminator>"

obj_assop
  -> "<assignOp>" data_nonfunction
  | "<unary>"

objprop_access
  -> "<id>"
  | arr_access

object_access
  -> "<id>" "<period>" objprop_access
  | arr_access "<period>" objprop_access

arr_access
  -> "<id>" "<LSqr>" arr_index "<RSqr>" add_arr_access
  | object_access "<Lsqr>" arr_index "<RSqr>" add_arr_access

add_arr_access
  -> "<LSqr>" arr_index "<RSqr>"
  | null

arr_index
  -> non_negative_numlit
  | arith_expression

return_values
  -> access_expr
  | null

return_statement
  -> "<returnState>" return_values "<terminator>"
  | void_return

relate_op
  -> "<relateOp>"

numid_stmt
  -> id_choices numid_op num_expr "<terminator>"
  | iterate_statement

numid_op
  -> "<assignOp>"
  | cond_operator

stringid_stmt -> id_choices stringid_op string_expr "<terminator>"

stringid_op
  -> "<addOp>"
  | "<assignOp>"

boolid_stmt
  -> "<assignOp>"
  | id_choices "<assignOp>" bool_expr "<terminator>"

id_choices
  -> "<id>"
  | arr_access
  | object_access

type_cast -> "<typeCast>" "<LParen>" type_cast_params "<RParen>" "<terminator>"
type_cast_params
  -> function_call
  | literals
  | expressions
  | id_choices

size_func -> "<sizeState>" "<LParen>" size_params "<RParen>" "<terminator>"
size_params
  -> array
  | id_choices
  | string_expr
  | function_call
  | "<stringLit>"
  | null

arr_methods
  -> "<absorbState>" "<LParen>" access_expr "<RParen>"
  | "<insertState>" "<LParen>" arith_expression "<comma>" access_expr "<RParen>"
  | "<uprootState>" "<LParen>" access_expr "<RParen>"
  | null

atchar -> "<strAccess>" "<LParen>" access_expr "<RParen>" "<terminator>" | null

trim_func -> "<trimState>" "<LParen>" access_expr "<RParen>" "<terminator>" | null