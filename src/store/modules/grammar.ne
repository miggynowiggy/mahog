program -> statement

statement -> desired_statement statement

desired_statement
  -> declare_data
  | const_declare
  | assign_data
  | null

declare_data -> data_id data_choices

data_id -> "data_type" "id"

data_choices
  -> "terminator"
  | assign_op data_nonfunction "terminator"

data_nonfunction
  -> literals
  | array_literal

const_declare
  -> const_start assign_op literals "terminator"

const_start -> "constant" "id"

assign_op -> "assign_op"

literals
  -> num_literals
  | "string_lit"
  | "bool_lit"

num_literals
  -> "nega_float_num_lit"
  | "float_num_lit"
  | "nega_num_lit"
  | "num_lit"

assign_data
  -> "id" "assign_op" data_nonfunction "terminator"

array_literal
  -> "L_sqr" array_contents "R_sqr"

array_contents
  -> literals append_element array_contents
  | null

append_element -> "comma" | null