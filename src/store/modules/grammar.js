// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "input", "symbols": ["global"]},
    {"name": "global", "symbols": ["data_declare"]},
    {"name": "global", "symbols": ["const_declare"]},
    {"name": "global", "symbols": []},
    {"name": "const_declare", "symbols": ["const_start", "const_choices"]},
    {"name": "const_start$string$1", "symbols": [{"literal":"<"}, {"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"s"}, {"literal":"t"}, {"literal":"T"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_start$string$2", "symbols": [{"literal":"<"}, {"literal":"i"}, {"literal":"d"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_start", "symbols": ["const_start$string$1", "const_start$string$2"]},
    {"name": "const_choices$string$1", "symbols": [{"literal":"<"}, {"literal":"a"}, {"literal":"s"}, {"literal":"s"}, {"literal":"i"}, {"literal":"g"}, {"literal":"n"}, {"literal":"O"}, {"literal":"p"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_choices$string$2", "symbols": [{"literal":"<"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_choices", "symbols": ["const_choices$string$1", "data_nonfunction", "const_choices$string$2"]},
    {"name": "const_choices$string$3", "symbols": [{"literal":"<"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_choices", "symbols": ["const_choices$string$3"]},
    {"name": "const_choices", "symbols": []},
    {"name": "data_declare", "symbols": ["data_id", "data_follow"]},
    {"name": "data_declare", "symbols": []},
    {"name": "data_id$string$1", "symbols": [{"literal":"<"}, {"literal":"d"}, {"literal":"a"}, {"literal":"t"}, {"literal":"a"}, {"literal":"T"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}, {"literal":"s"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_id$string$2", "symbols": [{"literal":"<"}, {"literal":"i"}, {"literal":"d"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_id", "symbols": ["data_id$string$1", "data_id$string$2"]},
    {"name": "data_follow$string$1", "symbols": [{"literal":"<"}, {"literal":"a"}, {"literal":"s"}, {"literal":"s"}, {"literal":"i"}, {"literal":"g"}, {"literal":"n"}, {"literal":"O"}, {"literal":"p"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_follow$string$2", "symbols": [{"literal":"<"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_follow", "symbols": ["data_follow$string$1", "data_nonfunction", "data_follow$string$2"]},
    {"name": "data_follow$string$3", "symbols": [{"literal":"<"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_follow", "symbols": ["data_follow$string$3"]},
    {"name": "data_follow", "symbols": []},
    {"name": "data_nonfunction", "symbols": ["literals"], "postprocess": id},
    {"name": "data_nonfunction", "symbols": ["id_choices"]},
    {"name": "num_lit", "symbols": ["float_lit"], "postprocess": id},
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
    {"name": "literals", "symbols": ["num_lit"], "postprocess": id},
    {"name": "literals", "symbols": ["str_lit"], "postprocess": id},
    {"name": "literals", "symbols": ["bool_lit"], "postprocess": id},
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
