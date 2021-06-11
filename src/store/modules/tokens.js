const tokens = {
  id: "id",

  string_lit: "string literal",
  nega_float_num_lit: "number literal",
  float_num_lit: "number literal",
  nega_num_lit: "number literal",
  num_lit: "number literal",
  bool_lit: "true or false",
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

  return_word: "return",

  trim: "trim",
  size: "size",
  absorb: "absorb",
  insert_word: "insert",
  uproot: "uproot",
  atChar_word: "atChar",
  atPos_word: "atPos",

  comment: "comment",
  multiline: "multilineComment",

  comma: ",",
  colon: ":",
  period: ".",
  terminator: ";",

  L_paren: "(",
  R_paren: ")",
  L_curl: "{",
  R_curl: "}",
  L_sqr: "[",
  R_sqr: "]",

  nega_sign: "~",
  add_op: "+",
  subtract_op: "-",
  multiply_op: "*",
  divide_op: "/",
  modulo_op: "%",

  add_assign_op: "+=",
  subtract_assign_op: "-=",
  multiply_assign_op: "*=",
  divide_assign_op: "/=",
  modulo_assign_op: "%=",

  assign_only_op: "=",
  not_equal_op: "!=",
  equal_to_op: "==",

  not_op: "!",
  and_op: "&&",
  or_op: "||",

  greater_than_op: ">",
  greater_equal_op: ">=",
  less_than_op: "<",
  less_equal_op: "<=",

  unary: "++ or --",

  EOF: ""
};

export default tokens;