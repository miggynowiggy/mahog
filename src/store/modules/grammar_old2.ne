
input -> global

global
  -> data_declare global
  | const_declare global
  | object_dec global
  | array global
  | comment global

const_declare -> const_start const_choices

const_start -> "<constType>" "<id>"

const_choices
  -> "<assignOp>" data_nonfunction "<terminator>"
  | "<terminator>"

data_declare -> data_id data_follow

data_id -> "<dataTypes>" "<id>"

data_follow
  -> "<assignOp>" data_nonfunction "<terminator>"
  | "<terminator>"

data_nonfunction
  -> literals
  | id_choices
  | array

# Objects
object_dec
  -> "<obj>" "<id>" "<assignOp>" "<LCurl>" obj_props "<RCurl>" "<terminator>"

obj_props
  -> data_id "<colon>" literals additional_props

additional_props
  -> "<comma>" obj_props
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

# Arrays
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

arr_methods
  -> "<absorbState>" "<LParen>" access_expr "<RParen>"
  | "<insertState>" "<LParen>" arith_expression "<comma>" access_expr "<RParen>"
  | "<uprootState>" "<LParen>" access_expr "<RParen>"
  | null

arr_access
  -> "<id>" "<LSqr>" arr_index "<RSqr>" add_arr_access
  | object_access "<Lsqr>" arr_index "<RSqr>" add_arr_access

add_arr_access
  -> "<LSqr>" arr_index "<RSqr>"
  | null

arr_index
  -> "<nonNegaNumLit>"
  | arith_expression

# Literals
literals
  -> num_lit
  | str_lit
  | bool_lit

num_lit
  -> float_lit
  | "<nonNegaNumLit>"
  | "<negaNumLit>"

float_lit
  -> "<nonNegaNumLit>" "<period>" "<nonNegaNumLit>"
  | "<negaNumLit>" "<period>" "<nonNegaNumLit>"

str_lit
  -> "<stringLit>"

bool_lit
  -> "<boolLit>"

# ID Choices
id_choices
  -> "<id>"
  | arr_access
  | object_access

# Aritmetic Expression
arith_expression
  -> arith_operand additional_arith
  | "<LParen>" arith_operand additional_arith "<RParen>"

arith_operand
  -> id_choices
  | "nonNegaNumLit"
  | arith_expression

additional_arith
  -> "<arithOp>" arith_operand additional_arith
  | null

# Comments
comment -> "<comment>"
