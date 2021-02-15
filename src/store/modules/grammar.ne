
input -> global

global
  -> data_declare global
  | const_declare global
  | object_dec global

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

object_dec
  -> "<obj>" "<id>" "<assignOp>" "<LCurl>" obj_props "<RCurl>" "<terminator>"

obj_props
  -> data_id "<colon>" literals additional_props

additional_props
  -> "<comma>" obj_props
  | null

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

id_choices
  -> "<id>"
