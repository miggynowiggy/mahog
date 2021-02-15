// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "input", "symbols": ["global"]},
    {"name": "global", "symbols": ["data_declare", "global"]},
    {"name": "global", "symbols": ["const_declare", "global"]},
    {"name": "global", "symbols": ["object_dec", "global"]},
    {"name": "const_declare", "symbols": ["const_start", "const_choices"]},
    {"name": "const_start$string$1", "symbols": [{"literal":"<"}, {"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"s"}, {"literal":"t"}, {"literal":"T"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_start$string$2", "symbols": [{"literal":"<"}, {"literal":"i"}, {"literal":"d"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_start", "symbols": ["const_start$string$1", "const_start$string$2"]},
    {"name": "const_choices$string$1", "symbols": [{"literal":"<"}, {"literal":"a"}, {"literal":"s"}, {"literal":"s"}, {"literal":"i"}, {"literal":"g"}, {"literal":"n"}, {"literal":"O"}, {"literal":"p"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_choices$string$2", "symbols": [{"literal":"<"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_choices", "symbols": ["const_choices$string$1", "data_nonfunction", "const_choices$string$2"]},
    {"name": "const_choices$string$3", "symbols": [{"literal":"<"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_choices", "symbols": ["const_choices$string$3"]},
    {"name": "data_declare", "symbols": ["data_id", "data_follow"]},
    {"name": "data_id$string$1", "symbols": [{"literal":"<"}, {"literal":"d"}, {"literal":"a"}, {"literal":"t"}, {"literal":"a"}, {"literal":"T"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}, {"literal":"s"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_id$string$2", "symbols": [{"literal":"<"}, {"literal":"i"}, {"literal":"d"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_id", "symbols": ["data_id$string$1", "data_id$string$2"]},
    {"name": "data_follow$string$1", "symbols": [{"literal":"<"}, {"literal":"a"}, {"literal":"s"}, {"literal":"s"}, {"literal":"i"}, {"literal":"g"}, {"literal":"n"}, {"literal":"O"}, {"literal":"p"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_follow$string$2", "symbols": [{"literal":"<"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_follow", "symbols": ["data_follow$string$1", "data_nonfunction", "data_follow$string$2"]},
    {"name": "data_follow$string$3", "symbols": [{"literal":"<"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_follow", "symbols": ["data_follow$string$3"]},
    {"name": "data_nonfunction", "symbols": ["literals"]},
    {"name": "data_nonfunction", "symbols": ["id_choices"]},
    {"name": "object_dec$string$1", "symbols": [{"literal":"<"}, {"literal":"o"}, {"literal":"b"}, {"literal":"j"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "object_dec$string$2", "symbols": [{"literal":"<"}, {"literal":"i"}, {"literal":"d"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "object_dec$string$3", "symbols": [{"literal":"<"}, {"literal":"a"}, {"literal":"s"}, {"literal":"s"}, {"literal":"i"}, {"literal":"g"}, {"literal":"n"}, {"literal":"O"}, {"literal":"p"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "object_dec$string$4", "symbols": [{"literal":"<"}, {"literal":"L"}, {"literal":"C"}, {"literal":"u"}, {"literal":"r"}, {"literal":"l"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "object_dec$string$5", "symbols": [{"literal":"<"}, {"literal":"R"}, {"literal":"C"}, {"literal":"u"}, {"literal":"r"}, {"literal":"l"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "object_dec$string$6", "symbols": [{"literal":"<"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "object_dec", "symbols": ["object_dec$string$1", "object_dec$string$2", "object_dec$string$3", "object_dec$string$4", "obj_props", "object_dec$string$5", "object_dec$string$6"]},
    {"name": "obj_props$string$1", "symbols": [{"literal":"<"}, {"literal":"c"}, {"literal":"o"}, {"literal":"l"}, {"literal":"o"}, {"literal":"n"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "obj_props", "symbols": ["data_id", "obj_props$string$1", "literals", "additional_props"]},
    {"name": "additional_props$string$1", "symbols": [{"literal":"<"}, {"literal":"c"}, {"literal":"o"}, {"literal":"m"}, {"literal":"m"}, {"literal":"a"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "additional_props", "symbols": ["additional_props$string$1", "obj_props"]},
    {"name": "additional_props", "symbols": []},
    {"name": "literals", "symbols": ["num_lit"]},
    {"name": "literals", "symbols": ["str_lit"]},
    {"name": "literals", "symbols": ["bool_lit"]},
    {"name": "num_lit", "symbols": ["float_lit"]},
    {"name": "num_lit$string$1", "symbols": [{"literal":"<"}, {"literal":"n"}, {"literal":"o"}, {"literal":"n"}, {"literal":"N"}, {"literal":"e"}, {"literal":"g"}, {"literal":"a"}, {"literal":"N"}, {"literal":"u"}, {"literal":"m"}, {"literal":"L"}, {"literal":"i"}, {"literal":"t"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "num_lit", "symbols": ["num_lit$string$1"]},
    {"name": "num_lit$string$2", "symbols": [{"literal":"<"}, {"literal":"n"}, {"literal":"e"}, {"literal":"g"}, {"literal":"a"}, {"literal":"N"}, {"literal":"u"}, {"literal":"m"}, {"literal":"L"}, {"literal":"i"}, {"literal":"t"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "num_lit", "symbols": ["num_lit$string$2"]},
    {"name": "float_lit$string$1", "symbols": [{"literal":"<"}, {"literal":"n"}, {"literal":"o"}, {"literal":"n"}, {"literal":"N"}, {"literal":"e"}, {"literal":"g"}, {"literal":"a"}, {"literal":"N"}, {"literal":"u"}, {"literal":"m"}, {"literal":"L"}, {"literal":"i"}, {"literal":"t"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "float_lit$string$2", "symbols": [{"literal":"<"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}, {"literal":"i"}, {"literal":"o"}, {"literal":"d"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "float_lit$string$3", "symbols": [{"literal":"<"}, {"literal":"n"}, {"literal":"o"}, {"literal":"n"}, {"literal":"N"}, {"literal":"e"}, {"literal":"g"}, {"literal":"a"}, {"literal":"N"}, {"literal":"u"}, {"literal":"m"}, {"literal":"L"}, {"literal":"i"}, {"literal":"t"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "float_lit", "symbols": ["float_lit$string$1", "float_lit$string$2", "float_lit$string$3"]},
    {"name": "float_lit$string$4", "symbols": [{"literal":"<"}, {"literal":"n"}, {"literal":"e"}, {"literal":"g"}, {"literal":"a"}, {"literal":"N"}, {"literal":"u"}, {"literal":"m"}, {"literal":"L"}, {"literal":"i"}, {"literal":"t"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "float_lit$string$5", "symbols": [{"literal":"<"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}, {"literal":"i"}, {"literal":"o"}, {"literal":"d"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "float_lit$string$6", "symbols": [{"literal":"<"}, {"literal":"n"}, {"literal":"o"}, {"literal":"n"}, {"literal":"N"}, {"literal":"e"}, {"literal":"g"}, {"literal":"a"}, {"literal":"N"}, {"literal":"u"}, {"literal":"m"}, {"literal":"L"}, {"literal":"i"}, {"literal":"t"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "float_lit", "symbols": ["float_lit$string$4", "float_lit$string$5", "float_lit$string$6"]},
    {"name": "str_lit$string$1", "symbols": [{"literal":"<"}, {"literal":"s"}, {"literal":"t"}, {"literal":"r"}, {"literal":"i"}, {"literal":"n"}, {"literal":"g"}, {"literal":"L"}, {"literal":"i"}, {"literal":"t"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "str_lit", "symbols": ["str_lit$string$1"]},
    {"name": "bool_lit$string$1", "symbols": [{"literal":"<"}, {"literal":"b"}, {"literal":"o"}, {"literal":"o"}, {"literal":"l"}, {"literal":"L"}, {"literal":"i"}, {"literal":"t"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bool_lit", "symbols": ["bool_lit$string$1"]},
    {"name": "id_choices$string$1", "symbols": [{"literal":"<"}, {"literal":"i"}, {"literal":"d"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "id_choices", "symbols": ["id_choices$string$1"]}
]
  , ParserStart: "input"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
