// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "program", "symbols": ["statement"]},
    {"name": "program$string$1", "symbols": [{"literal":"E"}, {"literal":"O"}, {"literal":"F"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "program", "symbols": ["program$string$1"]},
    {"name": "statement", "symbols": ["desired_statement", "statement"]},
    {"name": "desired_statement", "symbols": ["declare_data"]},
    {"name": "desired_statement", "symbols": ["const_declare"]},
    {"name": "desired_statement", "symbols": ["assign_data"]},
    {"name": "desired_statement", "symbols": []},
    {"name": "declare_data", "symbols": ["data_id", "data_choices"]},
    {"name": "data_id$string$1", "symbols": [{"literal":"d"}, {"literal":"a"}, {"literal":"t"}, {"literal":"a"}, {"literal":"_"}, {"literal":"t"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_id$string$2", "symbols": [{"literal":"i"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_id", "symbols": ["data_id$string$1", "data_id$string$2"]},
    {"name": "data_choices$string$1", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_choices", "symbols": ["data_choices$string$1"]},
    {"name": "data_choices$string$2", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_choices", "symbols": ["assign_op", "data_nonfunction", "data_choices$string$2"]},
    {"name": "data_nonfunction", "symbols": ["literals"]},
    {"name": "data_nonfunction", "symbols": ["array_literal"]},
    {"name": "const_declare$string$1", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_declare", "symbols": ["const_start", "assign_op", "literals", "const_declare$string$1"]},
    {"name": "const_start$string$1", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"s"}, {"literal":"t"}, {"literal":"a"}, {"literal":"n"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_start$string$2", "symbols": [{"literal":"i"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "const_start", "symbols": ["const_start$string$1", "const_start$string$2"]},
    {"name": "assign_op$string$1", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"s"}, {"literal":"i"}, {"literal":"g"}, {"literal":"n"}, {"literal":"_"}, {"literal":"o"}, {"literal":"p"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "assign_op", "symbols": ["assign_op$string$1"]},
    {"name": "literals", "symbols": ["num_literals"]},
    {"name": "literals$string$1", "symbols": [{"literal":"s"}, {"literal":"t"}, {"literal":"r"}, {"literal":"i"}, {"literal":"n"}, {"literal":"g"}, {"literal":"_"}, {"literal":"l"}, {"literal":"i"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "literals", "symbols": ["literals$string$1"]},
    {"name": "literals$string$2", "symbols": [{"literal":"b"}, {"literal":"o"}, {"literal":"o"}, {"literal":"l"}, {"literal":"_"}, {"literal":"l"}, {"literal":"i"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "literals", "symbols": ["literals$string$2"]},
    {"name": "num_literals$string$1", "symbols": [{"literal":"n"}, {"literal":"e"}, {"literal":"g"}, {"literal":"a"}, {"literal":"_"}, {"literal":"f"}, {"literal":"l"}, {"literal":"o"}, {"literal":"a"}, {"literal":"t"}, {"literal":"_"}, {"literal":"n"}, {"literal":"u"}, {"literal":"m"}, {"literal":"_"}, {"literal":"l"}, {"literal":"i"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "num_literals", "symbols": ["num_literals$string$1"]},
    {"name": "num_literals$string$2", "symbols": [{"literal":"f"}, {"literal":"l"}, {"literal":"o"}, {"literal":"a"}, {"literal":"t"}, {"literal":"_"}, {"literal":"n"}, {"literal":"u"}, {"literal":"m"}, {"literal":"_"}, {"literal":"l"}, {"literal":"i"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "num_literals", "symbols": ["num_literals$string$2"]},
    {"name": "num_literals$string$3", "symbols": [{"literal":"n"}, {"literal":"e"}, {"literal":"g"}, {"literal":"a"}, {"literal":"_"}, {"literal":"n"}, {"literal":"u"}, {"literal":"m"}, {"literal":"_"}, {"literal":"l"}, {"literal":"i"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "num_literals", "symbols": ["num_literals$string$3"]},
    {"name": "num_literals$string$4", "symbols": [{"literal":"n"}, {"literal":"u"}, {"literal":"m"}, {"literal":"_"}, {"literal":"l"}, {"literal":"i"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "num_literals", "symbols": ["num_literals$string$4"]},
    {"name": "assign_data$string$1", "symbols": [{"literal":"i"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "assign_data$string$2", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"s"}, {"literal":"i"}, {"literal":"g"}, {"literal":"n"}, {"literal":"_"}, {"literal":"o"}, {"literal":"p"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "assign_data$string$3", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"t"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "assign_data", "symbols": ["assign_data$string$1", "assign_data$string$2", "data_nonfunction", "assign_data$string$3"]},
    {"name": "array_literal$string$1", "symbols": [{"literal":"L"}, {"literal":"_"}, {"literal":"s"}, {"literal":"q"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "array_literal$string$2", "symbols": [{"literal":"R"}, {"literal":"_"}, {"literal":"s"}, {"literal":"q"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "array_literal", "symbols": ["array_literal$string$1", "array_contents", "array_literal$string$2"]},
    {"name": "array_contents", "symbols": ["literals", "append_element", "array_contents"]},
    {"name": "array_contents", "symbols": []},
    {"name": "append_element$string$1", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"m"}, {"literal":"m"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "append_element", "symbols": ["append_element$string$1"]},
    {"name": "append_element", "symbols": []}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
