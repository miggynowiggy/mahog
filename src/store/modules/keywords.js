export default {
  namespaced: true,
  state: {
    keywords: [
      {
        text: "number",
        description:
          "A data type that both holds the value of whole numbers and floating numbers",
      },
      {
        text: "string",
        description:
          "A data type that holds the value of string or a character.",
      },
      {
        text: "boolean",
        description: "A data type that holds the value of true or false",
      },
      {
        text: "seed",
        description:
          "A dynamic type can hold any data type mentioned above. But the vale can be change one intantiated.",
      },
      {
        text: "stone",
        description:
          "A dynamic type can hold any data types mentioned about. The value can be changed once instantiated.",
      },
      {
        text: "void",
        description: "A special type that represents the absence of value.",
      },
      {
        text: "null",
        description: "Denotes that a variable does not have a value.",
      },
      {
        text: "object",
        description:
          "A structure type that allows the end-user to combine data items of different kinds.",
      },
      {
        text: "water",
        description: "A function that takes an input value from the keyboard.",
      },
      {
        text: "carve",
        description:
          "A function that can print the provided data or user-defined message on console or monitor.",
      },
      {
        text: "if",
        description:
          "Executes a statement or group of statements if the specified condition is true.",
      },
      {
        text: "elif",
        description:
          "Performed after an if statement that if true, performs the specified statement or group of statements.",
      },
      {
        text: "else",
        description:
          "Execute a statement or group of statements a specified condition is false.",
      },
      {
        text: "cycle",
        description:
          "Executes a statement or group of statements multiple times and abbreviates the code that manages the loop variable.",
      },
      {
        text: "during",
        description:
          "Repeats a statement or group of statements while a given condition is true. It tests the condition first before executing the loop body.",
      },
      {
        text: "break",
        description:
          "Forces the whole loop to stop, skipping any code in between.",
      },
      {
        text: "skip",
        description:
          "Forces the next iteration of the loop to take place, skipping any code in between.",
      },
      {
        text: "false",
        description: "A boolean literal results to false",
      },
      {
        text: "true",
        description: "A boolean literal results to true",
      },
      {
        text: "return",
        description: "Stops execution and returns to the calling function",
      },
      {
        text: "size",
        description:
          "A function used to determine the length of a string or an array.",
      },
      {
        text: "num",
        description:
          "A function used to type cast a non-number value to a number data type.",
      },
      {
        text: "str",
        description:
          "A function used to type cast a non-string value to a string data type.",
      },
      {
        text: "bol",
        description:
          "A function used to type cast a non-Boolean value to a Boolean data type.",
      },
      {
        text: "absorb",
        description: "A method that adds an element within an array",
      },
      {
        text: "insert",
        description:
          "A method that inserts an element within an array at any indexes",
      },
      {
        text: "uproot",
        description: "A method that deletes an element within an array",
      },
      {
        text: "atChar",
        description:
          "A function used to access a specific character in a string according to its position in the string.",
      },
      {
        text: "trim",
        description:
          "A function used to specify the number of digits after the decimal point in a floating number.",
      },
    ],
  },
  getters: {
    keywords: (state) => state.keywords,
  },
};
