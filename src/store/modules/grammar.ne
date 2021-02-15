
input -> global

global
  -> data_declare
  | const_declare
  | null

const_declare -> const_start const_choices

const_start -> "<constType>" "<id>"

const_choices
  -> "<assignOp>" data_nonfunction "<terminator>"
  | "<terminator>"
  | null


data_declare -> data_id data_follow | null
data_id -> "<dataTypes>" "<id>"

data_follow
  -> "<assignOp>" data_nonfunction "<terminator>"
  | "<terminator>"
  | null

data_nonfunction
  -> literals {% id %}
  | id_choices

num_lit
  -> float_lit {% id %}
  | "<nonNegaNumLit>"
  | "<negaNumLit>"

float_lit
  -> "<nonNegaNumLit>" "<period>" "<nonNegaNumLit>"
  | "<negaNumLit>" "<period>" "<nonNegaNumLit>"

str_lit
  -> "<stringLit>"

bool_lit
  -> "<boolLit>"

literals
  -> num_lit {% id %}
  | str_lit {% id %}
  | bool_lit {% id %}

id_choices
  -> "<id>"