export default {
  namespaced: true,
  state: {
    symbols: [
      {
        text: "+",
        description: "Adds two operands",
      },
      {
        text: "-",
        description: "Subtracts second operand from the first.",
      },
      {
        text: "*",
        description: "Multiplies both operands",
      },
      {
        text: "/",
        description: "Divides numerator by denominator",
      },
      {
        text: "%",
        description: "Gives the remainder after integer division",
      },
      {
        text: "++",
        description: "Increases integer value by one",
      },
      {
        text: "--",
        description: "Decreases integer value by one",
      },
      {
        text: "=",
        description: "Assigns the value from the right side to the left side",
      },
      {
        text: "+=",
        description:
          "Add the right operand to the left operand and assign the sum to the left operand",
      },
      {
        text: "-=",
        description:
          "Subtracts the right operand to the left operand and assigns the difference to the left operand",
      },
      {
        text: "*=",
        description:
          "Multiplies the right operand to the left operand and assigns the product to the left operand",
      },
      {
        text: "/=",
        description:
          "Divides the right operand to the left operand and assigns the quotient to the left operand",
      },
      {
        text: "%=",
        description:
          "Divides the right operand to the left operand and assigns the remainder to the left operand",
      },
      {
        text: "==",
        description:
          "Checks whether the values of the two operands are equal or not. If equal, then the condition becomes true",
      },
      {
        text: "!=",
        description:
          "Checks whether the values of the two operands are not equal or equal. If not equal, then the condition becomes true",
      },
      {
        text: ">",
        description:
          "Checks whether the value of the left operand is greater than the right operand. If yes, then the condition becomes true",
      },
      {
        text: "<",
        description:
          "Checks whether the value of the left operand is less than the right operand. If yes, then the condition becomes true.",
      },
      {
        text: ">=",
        description:
          "Checks whether the value of the left operand is greater than or equal to the right operand. If yes, then the condition becomes true.",
      },
      {
        text: "<=",
        description:
          "Checks whether the value of the left operand is less than or equal to the right operand. If yes, the condition becomes true.",
      },
      {
        text: "!",
        description: "Reverses the current state of the operand.",
      },
      {
        text: "&&",
        description: "If both operands are true, the condition is true",
      },
      {
        text: "||",
        description:
          "If either of the operands are true, the condition is true",
      },
      {
        text: ";",
        description: "Terminator",
      },
      {
        text: ",",
        description: "Separator",
      },
      {
        text: ".",
        description:
          "Decimal point; Also used to access a property in an object",
      },
      {
        text: '""',
        description: "Used in defining the value of a string",
      },
      {
        text: "''",
        description: "Used in defining the value of a string",
      },
      {
        text: "()",
        description:
          "Used in grouping operands, also used in enclosing conditions",
      },
      {
        text: "[]",
        description: "Used in initializing values in an array",
      },
      {
        text: "{}",
        description:
          "Used in specifying the body of a function, object, and conditionals",
      },
      {
        text: ":",
        description: "Used in objects",
      },
      {
        text: "\n",
        description: "Used in displaying newline character in a string literal",
      },
      {
        text: "\t",
        description: "Used in displaying tabs in a strng literal",
      },
      {
        text: "\\",
        description: "Used in displaying backslash in a string literal",
      },
      {
        text: "'",
        description:
          "Used in displaying single quotation mark in a string literal",
      },
      {
        text: '"',
        description:
          "Used in displaying double quotation marks in a string literal",
      },
      {
        text: "@",
        description: "Used in creating single-line comments",
      },
    ],
  },
  getters: {
    symbols: (state) => state.symbols,
  },
};
