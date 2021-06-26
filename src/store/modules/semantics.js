/* eslint-disable no-constant-condition */
const cloneDeep = require('lodash/cloneDeep');
export default {
  namespaced: true,
  state: {
    errors: [],
    tokenStream: [],
    declaredIDs: [],
    newTokenStream: [],
    stoppers: [
      '+', '-', '*', '/', '%', '&&', '||', '+=', '-=', '*=', '/=', '%=',
      '!=', '==', '<', '>', '<=', '>=', ';', ',', ')'
    ],
    allowedDataTypes: ['boolean', 'number', 'string'],
    allowedTokensInExpr: {
      "number": [
        'greaterThanOp', 'lessThanOp', 'greaterThanEqualOp', 'lessThanEqualOp', 'notEqualOp',
        'equalToOp', 'notOp', 'andOp', 'orOp', 'addOp', 'subtractOp', 'multiplyOp', 'divideOp',
        'moduloOp', 'LParen', 'RParen', 'true', 'false', 'numLit', 'negNumLit', 'size', 'num',
        'floatNumLit', 'negaFloatNumLit', 'comma', 'LSqr', 'RSqr', 'unary', 'increment', 'decrement',
        'addAssignOp', 'subtractAssignOp', 'multiplyAssignOp', 'divideAssignOp', 'moduloAssignOp'
      ],
      "string": ["addOp", "addAssignOp", "stringLit", 'LParen', 'RParen', 'LSqr', 'RSqr', 'comma', 'str'],
      "boolean": [
        'greaterThanOp', 'lessThanOp', 'greaterThanEqualOp', 'lessThanEqualOp', 'notEqualOp',
        'equalToOp', 'notOp', 'andOp', 'orOp', 'addOp', 'subtractOp', 'multiplyOp', 'divideOp',
        'moduloOp', 'LParen', 'RParen', 'true', 'false', 'numLit', 'negNumLit',
        'floatNumLit', 'negaFloatNumLit', 'stringLit', 'comma', 'LSqr', 'RSqr',
        'addAssignOp', 'subtractAssignOp', 'multiplyAssignOp', 'divideAssignOp', 'moduloAssignOp'
      ]
    }
  },
  getters: {
    errors: (state) => state.errors
  },
  mutations: {
    ADD_ERROR(state, payload) {
      state.errors.push(payload);
    },
    CLEAR_ERRORS(state) {
      state.errors = [];
      state.tokenStream = [];
      state.declaredIDs = [];
      state.newTokenStream = [];
    }
  },
  actions: {
    async ANALYZE({ rootGetters, commit, dispatch, state }) {
      const tokenStreamCopy = cloneDeep(rootGetters['lexical/lexemes']).filter(token => token.token !== 'comment' && token.token !== "multilineComment");
      state.tokenStream = cloneDeep(rootGetters['lexical/lexemes'].filter(t => t.token !== 'comment' && t.token !== 'multilineComment'));
      const N = tokenStreamCopy.length;
      const empty = { token: '', line: null, col: null };

      let dataTypes = ['stone', 'number', 'string', 'boolean', 'void'];
      state.declaredIDs = [];

      let index = 0;
      let stop = false;

      let functionEncountered = { name: 'global', data_type: '' };
      let nonFunctionBlock = false;

      while (index < N && !stop) {
        let prev = index - 1 >= 0 ? tokenStreamCopy[index - 1] : empty;
        let current = tokenStreamCopy[index];
        let next = index + 1 !== N ? tokenStreamCopy[index + 1] : empty;

        // Check variable, object and function declarations
        if (dataTypes.includes(current.token) && next.token.includes("id-")) {
          console.log('declaring data for: ', current.lexeme, next.lexeme);
          const isIdDeclared = state.declaredIDs.find(id => id.name === next.lexeme);
          const isIdFuncDec = tokenStreamCopy[index + 2].lexeme === '(';

          const allowedFuncDataTypes = ['stone', 'number', 'string', 'boolean', 'void'];
          if (allowedFuncDataTypes.includes(current.token) && !isIdDeclared) {
            const id = {
              data_type: current.token,
              name: next.lexeme,
              isArr: false,
              isArr2D: false,
              isFunc: isIdFuncDec,
              funcParams: [],
              isConst: false,
              isConstWithVal: false,
              constDataAssigned: '',
              scope: '',
              isValueDec: false
            };

            // for constant declaration
            if (current.token === 'stone') {
              console.log('getting constant declaration: ', current.lexeme, next.lexeme);
              id.isConst = true;
              if (tokenStreamCopy[index + 2].lexeme === '=') {
                id.isValueDec = true;
                const { next_index, data_type } = await dispatch("CHECK_STONE_EXPRESSION", {
                  starting_index: index + 3,
                  scope: functionEncountered.name
                });
                id.constDataAssigned = data_type;
                index = next_index;
              } else {
                id.isValueDec = false;
                index += 1;
              }
              id.scope = functionEncountered.name;
              state.declaredIDs.push(id);
            }

            // for function declaration
            else if (isIdFuncDec) {
              console.log("reading function declaration: ", next.lexeme);
              const funcName = next.lexeme;
              const funcParams = [];
              let param = { data_type: '', name: '', scope: '' };

              index += 2;
              current = tokenStreamCopy[index];

              // extract the parameters declared on the function
              while (current.lexeme !== '{') {
                console.log('reading function params: ', current);
                if ((current.lexeme === ',' || current.lexeme === ')')) {
                  param.scope = funcName;
                  funcParams.push({...param });
                  state.declaredIDs.push({
                    data_type: param.data_type,
                    name: param.name,
                    scope: funcName,
                    isArr: false,
                    isArr2D: false,
                    isObj: false,
                    properties: [],
                    isValueDec: false
                  });
                  param = { data_type: '', name: '', scope: '' };
                }
                else if (dataTypes.includes(current.token)) {
                  param.data_type = current.token
                }
                else if (current.lexeme !== '(') {
                  param.name = current.lexeme;
                }

                index += 1;
                current = tokenStreamCopy[index];
              }

              id.funcParams = funcParams.filter(p => p.name);
              id.scope = 'global';
              console.log('pushing func: ', id);
              functionEncountered = id;
              state.declaredIDs.push(id);
              console.log("declared id ins funct: ", state.declaredIDs);
            }

            // for assigning an array literal or non-array expression
            else if (!isIdFuncDec && tokenStreamCopy[index + 2].lexeme === '=') {
              let result;
              console.log('assigning value to data declaration');
              if (tokenStreamCopy[index + 3].lexeme === '[') {
                result = await dispatch("CHECK_ARR_EXPRESSION", {
                  starting_index: index + 3,
                  datatype: id.data_type,
                  terminating_symbol: [';']
                });

                if (!result.next_index) {
                  commit("ADD_ERROR", {
                    type: 'SEM',
                    code: 'invalid-variable-assignment',
                    message: `expression to assign does not match with the data type of the variable`,
                    line: current.line,
                    col: current.col
                  });
                  stop = true;
                  return;
                }

              } else {
                result = await dispatch("CHECK_EXPRESSION", {
                  starting_index: index + 3,
                  datatype: id.data_type,
                  terminating_symbol: [';'],
                  scope: functionEncountered.name
                });
                console.log('result: ', result);

                if (!result.next_index) {
                  commit("ADD_ERROR", {
                    type: 'SEM',
                    code: 'invalid-variable-assignment',
                    message: `expression to assign does not match with the data type of the variable`,
                    line: current.line,
                    col: current.col
                  });
                  stop = true;
                  return;
                }
              }

              index = result.next_index;
              id.isArr = result.isArr;
              id.isArr2D = result.isArr2D
              id.scope = functionEncountered.name;
              id.isValueDec = true;
              state.declaredIDs.push(id);
              console.log('declared id: ', state.declaredIDs);
            }

            // for variable declaration with no values
            else if (tokenStreamCopy[index + 2].lexeme === ';') {
              id.scope = functionEncountered.name;
              state.declaredIDs.push(id);
              console.log('declared id: ', state.declaredIDs);
              index += 3;
            }
          }

          // Show error when the variable being declared is already declared
          else if (dataTypes.includes(current.token) && isIdDeclared) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'variable-redeclaration',
              message: `Redeclared variable -> ${next.lexeme}`,
              line: current.line,
              col: current.col
            });
            stop = true;
            return;
          }
        }

        // for object declaration
        else if (current.token === 'object' && next.token.includes('id-')) {
          const isIdDeclared = state.declaredIDs.find(id => id.name === next.lexeme && (id.scope === functionEncountered.name || id.scope === 'global'));

          if (isIdDeclared) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'variable-redeclaration',
              message: `Redeclared variable -> ${next.lexeme}`,
              line: current.line,
              col: current.col
            });
            stop = true;
            return;

          // gather properties of the object
          } else if (!isIdDeclared && tokenStreamCopy[index + 2].lexeme === '=') {
            console.log("gathering object properties");
            const id = {
              data_type: current.token,
              name: next.lexeme,
              isArr: false,
              isObj: true,
              properties: [],
              scope: functionEncountered.name,
              isValueDec: true
            };

            index += 4;
            current = tokenStreamCopy[index];
            next = tokenStreamCopy[index + 1];
            let prop = {
              data_type: '',
              name: '',
              isArr: false,
              isArr2D: false
            };
            const allowedPropDataType = ['number', 'string', 'boolean'];

            while (current.lexeme !== '}') {

              if (current.token.includes('id-')) {
                prop.name = current.lexeme;
                index += 1;
              }

              else if (current.lexeme === ':') {
                let result;
                if (tokenStreamCopy[index + 1].lexeme === '[') {
                  result = await dispatch("CHECK_EXPRESSION", {
                    starting_index: index + 1,
                    datatype: prop.data_type,
                    terminating_symbol: [']', ','],
                    scope: functionEncountered.name
                  });

                  if (!result.next_index) {
                    commit("ADD_ERROR", {
                      type: 'SEM',
                      code: 'invalid-object-property-assignment',
                      message: `property value does not match the data type of the property`,
                      line: current.line,
                      col: current.col
                    });
                    stop = true;
                    return;
                  }
                } else {
                  result = await dispatch("CHECK_EXPRESSION", {
                    starting_index: index + 1,
                    datatype: prop.data_type,
                    terminating_symbol: [','],
                    scope: functionEncountered.name
                  });

                  if (!result.next_index) {
                    commit("ADD_ERROR", {
                      type: 'SEM',
                      code: 'invalid-object-property-assignment',
                      message: `property value does not match the data type of the property`,
                      line: current.line,
                      col: current.col
                    });
                    stop = true;
                    return;
                  }
                }

                index = result.next_index;
                prop.isArr = result.isArr;
                prop.isArr2D = result.isArr2D;
              }

              else if (current.lexeme === ',') {
                id.properties.push({ ...prop });
                prop.data_type = '';
                prop.name = '';
                prop.isArr = false;
                prop.isArr2D = false;
                index += 1;
              }

              else if (allowedPropDataType.includes(current.lexeme) && !current.token.includes("id-")) {
                prop.data_type = current.lexeme;
                index += 1
              }

              else if (current.lexeme === 'void' || current.lexeme === 'object' || current.lexeme === 'stone') {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-object-property',
                  message: `[ ${current.lexeme} ] cannot be used as a data type for object property`,
                  line: current.line,
                  col: current.col
                });
                stop = true;
                return;
              }

              else {
                index += 1;
              }

              current = tokenStreamCopy[index];
              next = tokenStreamCopy[index + 1];
            }

            console.log("object declared: ", id);
            state.declaredIDs.push(id);
          }
        }

        // for conditional statements
        else if (current.lexeme === 'during' || current.lexeme === 'if' || current.lexeme === 'elif' || current.lexeme === 'cycle') {
          const { next_index } = await dispatch("CHECK_CONDITIONALS", {
            starting_index: index,
            scope: functionEncountered.name
          });

          if (!next_index) {
            return;
          }

          nonFunctionBlock = true;
          index = next_index;
          continue;
        }
        else if (nonFunctionBlock && current.lexeme === '}') {
          nonFunctionBlock = false;
          index += 1;
          continue;
        }

        // change the scoping of the variables if the closing tag for function is found
        else if (!nonFunctionBlock && current.lexeme === '}' && next.lexeme !== ';' && functionEncountered.name !== 'global') {
          functionEncountered = { name: 'global' };
          index += 1;
          continue;
        }
        // check the return value of a function, not the return on the global scope
        else if (!nonFunctionBlock && functionEncountered.name !== 'global' && current.lexeme === 'return') {
          console.log('return encountered: ', functionEncountered.name);
          index += 1;
          const { next_index } = await dispatch("CHECK_EXPRESSION", {
            starting_index: index,
            datatype: functionEncountered.data_type,
            terminating_symbol: [';'],
            scope: functionEncountered.name
          });

          if (!next_index) {
            stop = true;
            return;
          }

          index = next_index;
        }

        else if (current.lexeme === 'carve') {
          index += 2;
          if (state.tokenStream[index].lexeme === ')') index += 2;
          else {
            const { next_index } = await dispatch('CHECK_EXPRESSION', {
              starting_index: index,
              datatype: 'any',
              terminating_symbol: [')', ';'],
              scope: functionEncountered.name
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-carve-param',
                message: `carve() parameter should only be of single data type`,
                line: current.line,
                col: current.col
              });
              return
            }

            index = next_index;
          }
        }

        // check for id assignments
        else if (current.token.includes('id-')) {
          console.log('encountered id: ', functionEncountered);
          const { next_index } = await dispatch("CHECK_ID_EXPRESSION", {
            starting_index: index,
            scope: functionEncountered.name
          });

          if (!next_index) {
            stop = true;
            return;
          }

          index = next_index;
        }

        else {
          index += 1;
        }
      }
      console.table(state.declaredIDs);
    },
    async CHECK_STONE_EXPRESSION({ state, commit, dispatch }, details) {
      let index = details.starting_index;
      let current = state.tokenStream[index];
      let scope = details.scope;

      let initialDataType = null;
      while(current.lexeme !== ';') {
        if (current.token.includes('id-')) {
          const isIdDeclared = state.declaredIDs.find(id => id.name === current.lexeme && (id.scope === scope || id.scope === 'global'));
          if (!isIdDeclared) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'undeclared-variable',
              message: `Undeclared variable -> [ ${current.lexeme} ]`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              data_type: initialDataType
            }
          } else {
            initialDataType = isIdDeclared.data_type
          }

        } else if (!initialDataType && state.allowedTokensInExpr["number"].includes(current.token)) {
          initialDataType = "number";
        } else if (!initialDataType && state.allowedTokensInExpr["string"].includes(current.token)) {
          initialDataType = "string";
        } else if (!initialDataType && state.allowedTokensInExpr["boolean"].includes(current.token)) {
          initialDataType = "boolean";
        } else if (initialDataType && !state.allowedTokensInExpr[initialDataType].includes(current.token)) {
          commit("ADD_ERROR", {
            type: 'SEM',
            code: 'value-data-type-mismatch',
            message: `Operand [ ${current.lexeme} ] contains a different data typed value than the rest of the operands`,
            line: current.line,
            col: current.col
          });
          return {
            next_index: null,
            data_type: initialDataType
          }
        }
        console.log(initialDataType);

        index += 1;
        current = state.tokenStream[index];
      }

      return {
        next_index: index,
        data_type: initialDataType
      }
    },
    async CHECK_ID ({ state, commit, dispatch }, { starting_index, data_type, terminating_symbol, scope }) {
      const reservedMethods = ['atPos', 'atChar', 'absorb', 'insert', 'uproot'];
      let index = starting_index;
      let current = state.tokenStream[index];
      let next = state.tokenStream[index + 1];
      let stop = false;

      const isExprConditional = data_type === 'number' || data_type === 'boolean';

      while (!stop) {
        // just double check if the id is id
        if (current.token.includes("id-")) {
          const id = state.declaredIDs.find(i => i.name === current.lexeme && (i.scope === scope || i.scope === 'global'));
          console.log('id encountered: ', id, 'data type to check: ', data_type);
          if (!id) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'undeclared-variable',
              message: `undeclared variable -> [ ${current.lexeme} ]`,
              line: current.line,
              col: current.col
            });
            return { next_index: null, result: false };
          }
          else if (id && !id.isValueDec) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-variable-value',
              message: `variable -> [ ${id.name} ] contains undefined value`,
              line: current.line,
              col: current.col
            });
            return { next_index: null, result: false };
          }
          else if (id && data_type === 'any') {
            console.log('any data type encountered');
            return { next_index: index + 1, result: true, data_type: id.data_type }
          }
          else if (id && !id.isConst && !isExprConditional && id.data_type !== data_type && next.lexeme !== '.') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-variable-value',
              message: `variable -> [ ${id.name} ] does not contain a ${data_type} value`,
              line: current.line,
              col: current.col
            });
            return { next_index: null, result: false };
          }
          // check if the id is a constant
          else if (id && id.isConst && id.constDataAssigned && id.constDataAssigned !== data_type) {
            console.log('const assign: ', data_type)
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-variable-value',
              message: `variable -> [ ${id.name} ] does not contain a ${data_type} value`,
              line: current.line,
              col: current.col
            });
            return { next_index: null, result: false };
          }

          // check if the ID is an array access
          else if (id && next.lexeme === '[') {
            console.log('id is array access', id);

            if (id && !id.isArr) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-array-access',
                message: `variable -> [ ${id.name} ] is not declared with an array value`,
                line: current.line,
                col: current.col
              });
              return { next_index: null, result: false };
            }
            else if (id && id.isObj) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-array-access',
                message: `variable -> [ ${id.name} ] is not declared with an array value`,
                line: current.line,
                col: current.col
              });
              return { next_index: null, result: false };
            }
            else if (id && id.isArr && next.lexeme !== '[') {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-array-usage',
                message: `variable -> [ ${id.name} ] is contains an array value`,
                line: current.line,
                col: current.col
              });
              return { next_index: null, result: false };
            }
            else if (id && id.isArr && next.lexeme === '[') {
              index += 2;
              console.log('checking 1st arr expr: ', state.tokenStream[index]);

              const { next_index } = await dispatch("CHECK_EXPRESSION", {
                starting_index: index,
                datatype: 'number',
                terminating_symbol: [']'],
                scope: scope
              });

              console.log('1st element check: ', next_index);

              if (!next_index) {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-array-index',
                  message: `index provided to variable -> [ ${id.name}[] ] is not a numeric value`,
                  line: current.line,
                  col: current.col
                });
                return { next_index: null, result: false };
              }

              index = next_index + 1;
              console.log('checking if id array access has 2d: ', state.tokenStream[index].lexeme)
              if (!id.isArr2D && state.tokenStream[index].lexeme === '[') {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-array-access',
                  message: `variable -> [ ${id.name} ] is not declared with a 2-dimensional array value`,
                  line: current.line,
                  col: current.col
                });
                return { next_index: null, result: false };

              } else if (id.isArr2D && state.tokenStream[index].lexeme === '[') {
                index += 1;
                const { next_index } = await dispatch("CHECK_EXPRESSION", {
                  starting_index: index,
                  datatype: 'number',
                  terminating_symbol: [']'],
                  scope: scope
                });

                if (!next_index) {
                  commit("ADD_ERROR", {
                    type: 'SEM',
                    code: 'invalid-array-index',
                    message: `index provided to variable -> [ ${id.name}[] ] is not a numeric value`,
                    line: current.line,
                    col: current.col
                  });
                  return { next_index: null, result: false };
                }

                return { next_index: next_index, result: true };
              } else  {
                return { next_index: index, result: true };
              }
            }
          } // end of array checking

          // check for object checking
          else if (id && next.lexeme === '.' && !reservedMethods.includes(state.tokenStream[index + 1])) {
            index += 2;
            console.log('object checking', id)
            if (id && !id.isObj) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-object-access',
                message: `variable -> [ ${id.name} ] is not declared with an object literal value`,
                line: current.line,
                col: current.col
              });
              return { next_index: null, result: false };
            }
            else if (id && id.isObj) {
              const prop = id.properties.find(p => p.name === state.tokenStream[index].lexeme);
              console.log('object prop check', prop)
              if (!prop) {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-object-access',
                  message: `[ ${state.tokenStream[index]} ] is not a property of [ ${id.name} ]`,
                  line: current.line,
                  col: current.col
                });
                return { next_index: null, result: false };
              }
              else if (prop && !isExprConditional && prop.data_type !== data_type) {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'value-data-type-mismatch',
                  message: `[ ${id.name}.${prop.name} ] contains a non-${data_type} value`,
                  line: current.line,
                  col: current.col
                });
                return { next_index: null, result: false };
              }
              else if (prop && prop.isArr) {
                index += 1;
                if (state.tokenStream[index] !== '[') {
                  commit("ADD_ERROR", {
                    type: 'SEM',
                    code: 'invalid-array-access',
                    message: `[ ${id.name}.${prop.name} ] contains an array value`,
                    line: current.line,
                    col: current.col
                  });
                  return { next_index: null, result: false };

                } else if (state.tokenStream[index] === '[') {
                  index += 1;
                  const { next_index } = await dispatch("CHECK_EXPRESSION", {
                    starting_index: index,
                    datatype: 'number',
                    terminating_symbol: ']',
                    scope: scope
                  });

                  if (!next_index) {
                    commit("ADD_ERROR", {
                      type: 'SEM',
                      code: 'invalid-array-index',
                      message: `index provided to variable -> [ ${id.name}.${prop.name}[] ] is not a numeric value`,
                      line: current.line,
                      col: current.col
                    });
                    return { next: null, result: false }
                  }

                  index = next_index + 1;
                  if (prop.isArr2D && state.tokenStream[index] !== '[') {
                    commit("ADD_ERROR", {
                      type: 'SEM',
                      code: 'invalid-array-access',
                      message: `[ ${id.name}.${prop.name} ] contains a 2-dimentional array value`,
                      line: current.line,
                      col: current.col
                    });
                    return { next_index: null, result: false };

                  } else if (!prop.isArr && state.tokenStream[index] === '[') {
                    commit("ADD_ERROR", {
                      type: 'SEM',
                      code: 'invalid-array-access',
                      message: `[ ${id.name}.${prop.name} ] does not contain a 2-dimensional array value`,
                      line: current.line,
                      col: current.col
                    });
                    return { next_index: null, result: false };
                  } else if (prop.isArr && state.tokenStream[index] === '[') {
                    index += 1;
                    const { next_index } = await dispatch("CHECK_EXPRESSION", {
                      starting_index: index,
                      datatype: 'number',
                      terminating_symbol: [']'],
                      scope: scope
                    });

                    if (!next_index) {
                      commit("ADD_ERROR", {
                        type: 'SEM',
                        code: 'invalid-array-index',
                        message: `index provided to variable -> [ ${id.name}.${prop.name}[][] ] is not a numeric value`,
                        line: current.line,
                        col: current.col
                      });
                      return { next: null, result: false }
                    }

                    index = next_index;
                    return { next_index: index, result: true };
                  }
                }
              } else if (prop && !prop.isArr) {
                index += 1;
                return { next_index: index, result: true };
              }
            }
          } // end of object checking

          // check for atPos string method
          else if (next.lexeme === '.' && state.tokenStream[index + 1] === 'atPos') {
            if(id.data_type !== 'string' ) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-atPos-usage',
                message: `string method .atPos can only be used on a variable that holds a string value`,
                line: current.line,
                col: current.col
              });
              return { next: null, result: false }
            }
            index += 2;
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: 'number',
              terminating_symbol: [')'],
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-atPos-index',
                message: `string method .atPos was provided with a non-numeric value parameter`,
                line: current.line,
                col: current.col
              });
              return { next: null, result: false }
            }

            index = next_index;

          } /// end of atPos method checking

          // check for atChar string method
          else if (next.lexeme === '.' && state.tokenStream[index + 1] === 'atChar') {
            if(id.data_type !== 'string' ) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-atChar-usage',
                message: `string method .atChar can only be used on a variable that holds a string value`,
                line: current.line,
                col: current.col
              });
              return { next: null, result: false }
            }
            index += 2;
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: 'string',
              terminating_symbol: [')'],
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-atChar-index',
                message: `string method .atChar was provided with a non-numeric value parameter`,
                line: current.line,
                col: current.col
              });
              return { next: null, result: false }
            }

            index = next_index;

          } /// end of atChar method checking

          // check function call
          else if (id && next.lexeme === '(') {
            console.log('function call: ', id);
            if (id && !id.isFunc) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-function-call',
                message: `[ ${id.name} ] is not a function`,
                line: current.line,
                col: current.col
              });
              return { next: null, result: false }

            } else if (id && id.isFunc) {
              index += 2;
              console.log("processing parameters: ", state.tokenStream[index]);
              let paramList = [];
              let param = { indexes: [], terminating_symbol: '' };
              let parenEncounter = 0;
              current = state.tokenStream[index];
              while (true) {
                if (current.lexeme === '(') {
                  parenEncounter += 1;
                  index += 1;
                  param.indexes.push(index)
                  current = state.tokenStream[index];
                } else if (parenEncounter && current.lexeme === ')') {
                  parenEncounter -= 1;
                  index += 1;
                  param.indexes.push(index);
                  current = state.tokenStream[index];
                } else if (!parenEncounter && current.lexeme === ',') {
                  param.terminating_symbol = current.lexeme;
                  paramList.push({...param });
                  param.indexes = [];
                  param.terminating_symbol = '';
                  index += 1;
                  current = state.tokenStream[index];
                } else if (!parenEncounter && current.lexeme === ')') {
                  param.terminating_symbol = current.lexeme;
                  paramList.push({...param });
                  param.indexes = [];
                  param.terminating_symbol = '';
                  index += 1;
                  break;
                } else {
                  param.indexes.push(index);
                  index += 1;
                  current = state.tokenStream[index];
                }
              }

              paramList = paramList.filter(p => p.indexes.length);

              console.log('gathered params: ', paramList);

              if (id.funcParams.length !== paramList.length) {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-function-call',
                  message: `[ ${id.name} ] was expecting ${id.funcParams.length}, but supplied ${paramList.length}`,
                  line: current.line,
                  col: current.col
                });
                return { next: null, result: false }
              }

              for (let loopIndex = 0; loopIndex < paramList.length; loopIndex++) {
                const { next_index } = await dispatch("CHECK_EXPRESSION", {
                  starting_index: paramList[loopIndex].indexes[0],
                  datatype: id.funcParams[loopIndex].data_type,
                  terminating_symbol: [paramList[loopIndex].terminating_symbol],
                  scope: scope
                });

                if (!next_index) {
                  commit("ADD_ERROR", {
                    type: 'SEM',
                    code: 'value-data-type-mismatch',
                    message: `Data type mismatch on function parameter [ ${id.parameters[loopIndex].name} ] of function [ ${id.name} ]`,
                    line: current.line,
                    col: current.col
                  });
                  return { next_index: null, result: false };
                }

                index = next_index;
                console.log('param is valid');
              }

              console.log('next character: ', state.tokenStream[index]);
              return { next_index: index, result: true };
            }
            return { next_index: index, result: true };
          } // end of function call checking

          else if (next.lexeme !== '.' && next.lexeme !== '[' && next.lexeme !== '(') {
            console.log("id only")
            return {
              next_index: index + 1,
              result: true
            };
          }

        }
        else if (terminating_symbol.include(current.token)) {
          stop = true;
          return {
            next_index: index,
            result: true
          };
        }

        else {
          console.log('unhandled id check: ', state.tokenStream[index]);
          index += 1;
        }

        current = state.tokenStream[index];
        next = state.tokenStream[index + 1];
      }
      return {
        next_index: index,
        result: true
      };
    },
    async CHECK_ARR_EXPRESSION({ state, commit, dispatch }, { starting_index, terminating_symbol, datatype, scope }) {
      let index = starting_index;
      let N = state.tokenStream.length;
      let current = state.tokenStream[index];
      let next = index + 1 !== N ? state.tokenStream[index + 1] : { lexeme: '', token: '', col: 0, line: 0 };

      let arrCounter = 0;
      let isArr = false;
      let isArr2D = false;
      let stop = false;
      let data_type = datatype;

      isArr = true;
      index += 1; //advance to the first element of the array
      current = state.tokenStream[index];
      next = state.tokenStream[index + 1];

      if (data_type === 'any') {
        console.log('any data type on arr expr')
        let checkOperand = current;
        if (checkOperand.lexeme === '(') {
          let innerIndex = index;
          while (checkOperand.lexeme === '(') {
            checkOperand = state.tokenStream[innerIndex];
            innerIndex += 1;
          }
        }

        basisDataType = await dispatch("CHECK_OPERAND_TYPE", {
          operand: checkOperand
        });

        if (!basisDataType) {
          commit("ADD_ERROR", {
            type: 'SEM',
            code: 'invalid-expr-value',
            message: `cannot infer type of [ ${checkOperand.lexeme} ]`,
            line: current.line,
            col: current.col
          });
          return {
            next_index: null, result: false, isArr, isArr2D
          }

        } else {
          data_type = basisDataType;
        }
      }

      while(!stop) {
        console.log('checking array element content', current);
        if (current.lexeme === '[') {
          console.log('2d array encountered');
          isArr2D = true;
          arrCounter += 1;
          index += 1;
        }
        else if (isArr2D && current.lexeme === ']' && arrCounter) {
          console.log('2d array closed')
          arrCounter -= 1;
          index += 1;
        }
        else if (current.lexeme === ',') {
          console.log('array element separator encountered');
          index += 1;
        }
        else if (!arrCounter && (terminating_symbol.includes(current.lexeme) || current.lexeme === ']')) {
          console.log('terminating arr expr check');
          index += 1;
          stop = true;
          return {
            next_index: index, result: true, isArr, isArr2D
          };
        }
        else if (!state.allowedTokensInExpr[data_type].includes(current.token)) {
          // const { next_index } = await dispatch("CHECK_EXPRESSION", {
          //   starting_index: index,
          //   datatype: data_type,
          //   scope: scope,
          //   terminating_symbol: [',']
          // });
          // console.log('finished arr element eval: ', next_index);

          // if (!next_index) {
          //   return {
          //     next_index: null, result: false, isArr, isArr2D
          //   }
          // }

          // index = next_index;
          commit("ADD_ERROR", {
            type: 'SEM',
            code: 'invalid-expr-value',
            message: `[ ${current.lexeme} ] is not allowed in ${data_type} expression`,
            line: current.line,
            col: current.col
          });
          stop = true;
          return {
            next_index: null, result: false, isArr, isArr2D
          }
        } else {
          console.log('checking array element no case');
          index += 1;
        }

        current = state.tokenStream[index];
        next = index + 1 !== N ? state.tokenStream[index + 1] : { lexeme: '', token: '', col: 0, line: 0 };
      }
      console.log("returning to CHECK_EXPR:");
      return {
        next_index: index, result: true, isArr, isArr2D
      }
    },
    async CHECK_OPERAND_TYPE({ state, commit, dispatch }, { operand }) {
      if (operand.token.includes('id-')) {
        const id = state.declaredIDs.find(i => i.name === operand.lexeme);
        console.log('checking id type: ', id);
        if (!id) {
          commit("ADD_ERROR", {
            type: 'SEM',
            code: 'undeclared-variable',
            message: `Undeclared variable -> [ ${current.lexeme} ]`,
            line: current.line,
            col: current.col
          });
          return null;

        } else {
          console.log(id.data_type);
          return id.data_type;
        }

      } else {
        console.log('checking operand literal data type');
        const allowedData = ["string", "number", "boolean"];
        let matchedDataType;
        for (const datatype of allowedData) {
          console.log('checking ', datatype, ' accepted tokens...');
          if (state.allowedTokensInExpr[datatype].includes(operand.token)) {
            console.log('matched ', operand.token, ' to ', datatype);
            matchedDataType = datatype;
            break;
          }
          console.log('noting matched');
        }
        return matchedDataType;
      }
    },
    async CHECK_EXPRESSION({ state, commit, dispatch }, { starting_index, terminating_symbol, datatype, scope }) {
      try {
        let index = starting_index;
        let N = state.tokenStream.length;
        let current = state.tokenStream[index];
        let next;

        let parenCounter = 0
        let isArr = false;
        let isArr2D = false;
        let stop = false;
        let data_type = datatype;

        if (data_type === 'any') {
          console.log('any data type found on expr');
          let checkOperand = current;
          if (checkOperand.lexeme === '(') {
            let innerIndex = index;
            while (checkOperand.lexeme === '(') {
              checkOperand = state.tokenStream[innerIndex];
              innerIndex += 1;
            }
          }
          console.log('checkOperand: ', checkOperand);

          let basisDataType = await dispatch("CHECK_OPERAND_TYPE", {
            operand: checkOperand
          });

          console.log('operand data type: ', basisDataType);

          if (!basisDataType) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-expr-value',
              message: `cannot infer type of [ ${checkOperand.lexeme} ]`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null, result: false, isArr, isArr2D
            }

          } else {
            data_type = basisDataType;
          }
        }

        console.log('expression data type: ', data_type);

        while(!stop) {
          console.log("CHECK EXPR: ", current);
          console.log('is expr operand goods: ', state.allowedTokensInExpr[data_type].includes(current.token));

          //terminating condition
          if (!parenCounter && terminating_symbol.includes(current.lexeme)) {
            console.log('teminating the expr');
            // index += 1;
            stop = true;
          }
          // if opening paren is encountered, record it
          else if (current.lexeme === '(') {
            parenCounter += 1;
            index += 1;
          }
          // if the closing paren is encountered,
          else if (current.lexeme === ')' && parenCounter) {
            parenCounter -= 1;
            index += 1;
          }

          // check content of the id
          else if (current.token.includes('id-')) {
            console.log("id encountered");
            const { next_index } = await dispatch("CHECK_ID", {
              starting_index: index,
              data_type: data_type,
              terminating_symbol: [...state.stoppers],
              scope: scope,
            });

            if (!next_index) {
              return { next_index: null, result: false, isArr: false, isArr2D: false };
            }

            index = next_index;
            console.log('id check finish: ', state.tokenStream[index]);
          }

          // for input statement assignment
          else if (current.lexeme === 'water' && data_type !== 'string') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-expr-value',
              message: `water() returns a string literal`,
              line: current.line,
              col: current.col
            });
            stop = true;
            return {
              next_index: null, result: false, isArr, isArr2D
            }

          } else if (current.lexeme === 'water' && data_type === 'string') {
            index += 2;
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: 'string',
              terminating_symbol: [')'],
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-water-paramter',
                message: `water() only accepts string valued literals, identifier, or expression`,
                line: current.line,
                col: current.col
              });
              stop = true;
              return {
                next_index: null, result: false, isArr, isArr2D
              }
            }

            return {
              next_index: next_index, result: true, isArr, isArr2D
            }
          }

          // check for num type cast functions
          else if (current.lexeme === 'num' && !isExprConditional) {
            console.log("num typecast error")
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-type-cast-in-expr',
              message: `num() typecast function cannot be used in a ${data_type} expression`,
              line: current.line,
              col: current.col
            });
            stop = true;
            return {
              next_index: null, result: false, isArr, isArr2D
            }
          } else if (current.lexeme === 'num' && next.lexeme === '(') {
            console.log('checking num typecast')
            index += 2;
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: 'string',
              terminating_symbol: [')'],
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-num-cast-param',
                message: `num() typecast function only accepts string valued literal, indentifier, or expression`,
                line: current.line,
                col: current.col
              });
              stop = true;
              return {
                next_index: null, result: false, isArr, isArr2D
              }
            }

            index = next_index;
          }

          // check for str type cast functions
          else if (current.lexeme === 'str' && data_type !== 'string') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-type-cast-in-expr',
              message: `str() typecast function cannot be used in a ${data_type} expression`,
              line: current.line,
              col: current.col
            });
            stop = true;
            return {
              next_index: null, result: false, isArr, isArr2D
            }
          } else if (current.lexeme === 'str' && next.lexeme === '(') {
            index += 2;
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: 'number',
              terminating_symbol: [')'],
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-str-cast-param',
                message: `str() typecast function only accepts number or boolean valued literal, indentifier, or expression`,
                line: current.line,
                col: current.col
              });
              stop = true;
              return {
                next_index: null, result: false, isArr, isArr2D
              }
            }

            index = next_index;
          }

          // check for bol type cast functions
          else if (current.lexeme === 'bol' && data_type !== 'number' && data_type !== 'boolean') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-type-cast-in-expr',
              message: `bol() typecast function cannot be used in a ${data_type} expression`,
              line: current.line,
              col: current.col
            });
            stop = true;
            return {
              next_index: null, result: false, isArr, isArr2D
            }
          } else if (current.lexeme === 'str' && next.lexeme === '(') {
            index += 2;
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: 'any',
              terminating_symbol: [')'],
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-bol-cast-param',
                message: `bol() typecast function should have a consistent data type value in its parameter`,
                line: current.line,
                col: current.col
              });
              stop = true;
              return {
                next_index: null, result: false, isArr, isArr2D
              }
            }

            index = next_index;
          }

          // size function checking
          else if (current.lexeme === 'size' && data_type === 'string') {
            console.log('size function error');
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-expr-value',
              message: `[ ${current.lexeme} ] is not allowed in ${data_type} expression`,
              line: current.line,
              col: current.col
            });
            stop = true;
            return {
              next_index: null, result: false, isArr, isArr2D
            }

          } else if (current.lexeme === 'size') {
            console.log('size function encountered');
            const { next_index, isArr, isArr2D } = await dispatch("CHECK_SIZE", {
              starting_index: index,
              scope: scope,
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-size-func-param',
                message: `size() function only accepts an array literal or a string expression`,
                line: current.line,
                col: current.col
              });
              stop = true;
              return {
                next_index: null, result: false, isArr, isArr2D
              }
            }
            index += 2;
            const operand = state.tokenStream[index];
            console.log('checking first operand');
            if (operand.token.includes('id-')) {
              const { next_index } = await dispatch("CHECK_EXPRESSION", {
                starting_index: index,
                datatype: 'any',
                terminating_symbol: [')', [...state.stoppers]],
                scope: scope
              });

              if (!next_index) {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-size-func-param',
                  message: `size() function only accepts an array literal or a string expression`,
                  line: current.line,
                  col: current.col
                });
                stop = true;
                return {
                  next_index: null, result: false, isArr, isArr2D
                }
              }

              index = next_index;

              // const id = state.declaredIDs.find(i => i.name === operand.lexeme && (i.scope === scope || i.scope === 'global'));
              // console.log('size func id: ', id);
              // if (!id) {
              //   commit("ADD_ERROR", {
              //     type: 'SEM',
              //     code: 'undeclared-variable',
              //     message: `Undeclared variable -> [ ${operand.token} ]`,
              //     line: current.line,
              //     col: current.col
              //   });
              //   stop = true;
              //   return {
              //     next_index: null, result: false, isArr, isArr2D
              //   }
              // } else if (id && id.isConst && id.constDataAssigned !=='string') {
              //   commit("ADD_ERROR", {
              //     type: 'SEM',
              //     code: 'invalid-size-func-param',
              //     message: `size() function only accepts an array literal or a string expression`,
              //     line: current.line,
              //     col: current.col
              //   });
              //   stop = true;
              //   return {
              //     next_index: null, result: false, isArr, isArr2D
              //   }
              // }
              // else if (id && !id.isArr && id.data_type !== 'string') {
              //   commit("ADD_ERROR", {
              //     type: 'SEM',
              //     code: 'invalid-size-func-param',
              //     message: `size() function only accepts an array literal or a string expression`,
              //     line: current.line,
              //     col: current.col
              //   });
              //   stop = true;
              //   return {
              //     next_index: null, result: false, isArr, isArr2D
              //   }
              // } else {
              //   const { next_index } = await dispatch("CHECK_EXPRESSION", {
              //     starting_index: index,
              //     datatype: 'any',
              //     terminating_symbol: [')', [...state.stoppers]],
              //     scope: scope
              //   });

              //   if (!next_index) {
              //     commit("ADD_ERROR", {
              //       type: 'SEM',
              //       code: 'invalid-size-func-param',
              //       message: `size() function only accepts an array literal or a string expression`,
              //       line: current.line,
              //       col: current.col
              //     });
              //     stop = true;
              //     return {
              //       next_index: null, result: false, isArr, isArr2D
              //     }
              //   }

              //   index = next_index;
              // }
            } else if (operand.lexeme === '[') {
              const { next_index } = await dispatch("CHECK_ARR_EXPRESSION", {
                starting_index: index,
                datatype: 'any',
                terminating_symbol: [')'],
                scope: scope
              });

              if (!next_index) {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-size-func-param',
                  message: `size() function only accepts an array literal or a string expression`,
                  line: current.line,
                  col: current.col
                });
                stop = true;
                return {
                  next_index: null, result: false, isArr, isArr2D
                }
              }

              index = next_index;
            } else if (operand.token === 'stringLit') {
              const { next_index } = await dispatch("CHECK_EXPRESSION", {
                starting_index: index,
                datatype: 'string',
                terminating_symbol: [')'],
                scope: scope
              });

              if (!next_index) {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-size-func-param',
                  message: `size() function only accepts an array literal or a string expression`,
                  line: current.line,
                  col: current.col
                });
                stop = true;
                return {
                  next_index: null, result: false, isArr, isArr2D
                }
              }

              index = next_index;
            } else {
              console.log('no case to handle')
              index += 1;
            }
          }

          //check trim function
          else if (current.lexeme === 'trim' && (data_type === 'number' || data_type === 'boolean')) {
            index += 2;
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: 'number',
              terminating_symbol: [','],
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-trim-func-param',
                message: `trim() function parameter 1 only accepts number literal or a number expression`,
                line: current.line,
                col: current.col
              });
              stop = true;
              return {
                next_index: null, result: false, isArr, isArr2D
              }
            }

            index = next_index + 1;
            console.log('checking second trim parameter', state.tokenStream[index]);
            const trimparam2 = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: 'number',
              terminating_symbol: [')'],
              scope: scope
            });

            if (!trimparam2.next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-trim-func-param',
                message: `trim() function parameter 2 only accepts number literal or a number expression`,
                line: current.line,
                col: current.col
              });
              stop = true;
              return {
                next_index: null, result: false, isArr, isArr2D
              }
            }

            index = trimparam2.next_index;

          } else if (current.lexeme === 'trim' && (data_type !== 'number' && data_type !== 'boolean')) {
            console.log('trim function error');
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-expr-value',
              message: `[ ${current.lexeme} ] is not allowed in ${data_type} expression`,
              line: current.line,
              col: current.col
            });
            stop = true;
            return {
              next_index: null, result: false, isArr, isArr2D
            }
          }

          // check if the operand is legit
          else if (!state.allowedTokensInExpr[data_type].includes(current.token)) {
            console.log('invalid token');
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-expr-value',
              message: `[ ${current.lexeme} ] is not allowed in ${data_type} expression`,
              line: current.line,
              col: current.col
            });
            stop = true;
            return {
              next_index: null, result: false, isArr, isArr2D
            }
          }

          else {
            index += 1;
            console.log('no case to hold')
          }

          current = state.tokenStream[index];
          next = index + 1 !== N ? state.tokenStream[index + 1] : { lexeme: '', token: '', col: 0, line: 0 };
        }

        console.log("expression is correct");
        return {
          next_index: index, result: true, isArr, isArr2D
        }
      } catch (err) {
        return {
          next_index: null, result: false, isArr: false, isArr2D: false
        }
      }
    },
    async CHECK_ID_EXPRESSION({ state, commit, dispatch }, { starting_index, scope, terminating_symbol }) {
      let index = starting_index;
      let current = state.tokenStream[index];
      let next = state.tokenStream[index + 1];
      let allowedAssOp = ['=', '+=', '-=', '*=', '/=', '%='];

      let data_type = null;
      let idToAssign = null;
      let accessProp = null;
      let arrayMethods = ['absorb', 'insert', 'uproot'];
      while (current.lexeme !== ';') {
        // check if the id is an array access
        if (current.token.includes('id-') && next.lexeme === '[') {
          console.log('id expr is an array access');
          const id = state.declaredIDs.find(i => i.name === current.lexeme && (i.scope === scope || i.scope === 'global'));
          idToAssign = {...id};

          if (!id) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'undeclared-variable',
              message: `Undeclared variable -> [ ${current.lexeme} ]`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }
          else if (id && !id.isArr) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-array-access',
              message: `variable [ ${id.name} ] does not contain an array value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          index += 2;
          const { next_index } = await dispatch("CHECK_EXPRESSION", {
            starting_index: index,
            datatype: 'number',
            terminating_symbol: [']'],
            scope: scope
          });

          if (!next_index) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-array-index',
              message: `[ ${current.lexeme} ] is supplied with a non-numeric value index`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          index = next_index + 1;
          if (id && !id.isArr2D && state.tokenStream[index].lexeme === '[') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-array-access',
              message: `[ ${id.name} ] is not declared as a 2-dimentional array`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }
          else if (id && id.isArr2D && state.tokenStream[index].lexeme === '[') {
            index += 1
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: 'number',
              terminating_symbol: [']'],
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-array-access',
                message: `[ ${id.name} ] is supplied with a non-numeric value index`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              };
            }

            index = next_index;
          }
          data_type = id.data_type;
        }
        // check array methods code
        else if (current.token.includes('id-') && next.lexeme === '.' && arrayMethods.includes(state.tokenStream[index + 2])) {
          const id = state.declaredIDs.find(i => i.name === current.lexeme && (i.scope === scope || i.scope === 'global'));

          if (!id) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'undeclared-variable',
              message: `Undeclared variable -> [ ${current.lexeme} ]`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };

          } else if (id && !id.isArr) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-object-access',
              message: `Variable [ ${id.name} ] does not contain an object value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          index += 4;
          console.log('arr method encountered: ', state.tokenStream[index].lexeme);
        }
        // check if the id is an object access
        else if (current.token.includes('id-') && next.lexeme === '.') {
          console.log('id expr is an object access');
          let propToAssign;
          const id = state.declaredIDs.find(i => i.name === current.lexeme && (i.scope === scope || i.scope === 'global'));

          if (!id) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'undeclared-variable',
              message: `Undeclared variable -> [ ${current.lexeme} ]`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };

          } else if (id && !id.isObj) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-object-access',
              message: `variable [ ${id.name} ] does not contain an object value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          index += 2;
          const prop = id.properties.find(p => p.name === state.tokenStream[index].lexeme);
          propToAssign = prop;
          console.log('checking property with array: ', prop);
          if (!prop) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-object-access',
              message: `[ ${state.tokenStream[index].lexeme} ] is not a property in object [ ${id.name} ]`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }
          else if (prop && !prop.isArr && state.tokenStream[index + 1].lexeme !== '[' && state.tokenStream[index + 1].lexeme === '=') {
            index += 1;
            data_type = prop.data;
          }
          else if (prop && !prop.isArr && state.tokenStream[index + 1].lexeme === '[') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-array-access',
              message: `[ ${id.name}.${prop.name} ] does not contain an array value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }
          else if (prop && prop.isArr && state.tokenStream[index + 1].lexeme !== '[') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-array-access',
              message: `[ ${id.name}.${prop.name} ] contains an array value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }
          else if (prop && prop.isArr && state.tokenStream[index + 1].lexeme === '[') {
            index += 2;
            console.log('property is an array: ', state.tokenStream[index]);
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: 'number',
              terminating_symbol: [']'],
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-array-index',
                message: `[ ${id.name}.${prop.name} ] is supplied with a non-numeric value index`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              };
            }

            index = next_index + 1;
            console.log("check if there is 2d arr access: ", state.tokenStream[index].lexeme);
            if (!prop.isArr2D && state.tokenStream[index].lexeme === '[') {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-array-access',
                message: `[ ${id.name}.${prop.name} ] is not declared as a 2-dimensional array`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              };
            }
            else if (prop.isArr2D && state.tokenStream[index].lexeme === '[') {
              index += 1;
              console.log('checking 2d arr expr', state.tokenStream[index].lexeme);
              const { next_index } = await dispatch("CHECK_EXPRESSION", {
                starting_index: index,
                datatype: 'number',
                terminating_symbol: [']'],
                scope: scope
              });

              if (!next_index) {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-array-index',
                  message: `[ ${id.name}.${prop.name} ] is supplied with a non-numeric value index`,
                  line: current.line,
                  col: current.col
                });
                return {
                  next_index: null,
                  result: false
                };
              }

              index = next_index + 1;
            }
          }

          data_type = prop.data_type;
          idToAssign = id;
          accessProp = propToAssign;
        }
        // else if (current.token.includes('id-') && next.lexeme === '(') {
        //   commit("ADD_ERROR", {
        //     type: 'SEM',
        //     code: 'invalid-variable-assignment',
        //     message: `value is being assigned to a function call`,
        //     line: current.line,
        //     col: current.col
        //   });
        //   return {
        //     next_index: null,
        //     result: false
        //   };
        // }
        else if (current.token.includes('id-') && (next.lexeme === '++' || next.lexeme === '--')) {
          console.log('unary expresion encountered');
          const id = state.declaredIDs.finc(i => i.name === current.lexeme && (i.scope === scope || i.scope === 'global'));
          if (!id) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'undeclared-variable',
              message: `Undeclared variable -> [ ${current.lexeme} ]`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          } else if (id && id.data_type !== 'number') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-unary-usage',
              message: `[ ${id.name} ] does not hold a numerical value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          data_type = id.data_type;
          index += 2;
        }
        else if (current.token.includes('id-') && next.lexeme !== '.' && next.lexeme !== '[') {
          console.log('id expr is an id only');
          const id = state.declaredIDs.find(i => i.name === current.lexeme && (i.scope === scope || i.scope === 'global'));
          console.log(id, scope);
          if (!id) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'undeclared-variable',
              message: `Undeclared variable -> [ ${current.lexeme} ]`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }
          else if (id && id.isObj) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-object-use',
              message: `[ ${id.name} ] contains an object value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }
          else if (id && id.isArr) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-array-use',
              message: `[ ${id.name} ] contains an array value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }
          else if (id.isConst === true && next.lexeme === '=') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-constant-assigment',
              message: `Invalid constant reassignment`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          data_type = id.data_type;
          index += 1;

        }
        else if (allowedAssOp.includes(current.lexeme)) {
          console.log("id before =", idToAssign);
          index += 1;
          const { next_index } = await dispatch("CHECK_EXPRESSION", {
            starting_index: index,
            datatype: data_type,
            terminating_symbol: [';'],
            scope: scope
          });

          if (!next_index) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-variable-assignment',
              message: `value being assigned to [ ${state.tokenStream[index - 2].lexeme}${accessProp ? '.' + accessProp.name : ''} ] is not valid`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          index = next_index;
          console.log('finished reading id expr: ', state.tokenStream[index]);
          return {
            next_index: index,
            result: true
          };

        } else {
          return {
            next_index: index,
            result: true
          };
        }

        current = state.tokenStream[index];
        next = state.tokenStream[index + 1];
      }

      return {
        next_index: index,
        result: true
      };
    },
    async CHECK_CONDITIONALS({ state, commit, dispatch }, { starting_index, scope }) {
      let index = starting_index;
      let current = state.tokenStream[index];
      let next = state.tokenStream[index + 1];

      if (current.lexeme === 'if' || current.lexeme === 'elif' || current.lexeme === 'during') {
        index += 2;
        const { next_index } = await dispatch("CHECK_EXPRESSION", {
          starting_index: index,
          datatype: 'boolean',
          terminating_symbol: [')', '{'],
          scope: scope,
        });

        if (!next_index) {
          commit("ADD_ERROR", {
            type: 'SEM',
            code: 'invalid-conditional',
            message: `invalid conditional statement`,
            line: current.line,
            col: current.col
          });
          return { next_index: null, result: false }
        }

        return {
          next_index,
          result: true
        }

      } else if (current.lexeme === 'cycle') {
        index += 2; // proceed to the initialization part
        current = state.tokenStream[index];

        if (current.token.includes('id-')) {
          const { next_index } = await dispatch("CHECK_ID_EXPRESSION", {
            starting_index: index,
            terminating_symbol: [';'],
            scope: scope
          });

          if (!next_index) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-loop-initialization',
              message: `loop initialization statement is invalid`,
              line: current.line,
              col: current.col
            });
            return { next_index: null, result: false }
          }

          index += next_index;

        } else if (state.allowedDataTypes.includes(current.token)) {
          console.log('declaration encountered');
          next = state.tokenStream[index + 1];
          const id = {
            data_type: current.token,
            name: next.lexeme,
            isArr: false,
            isArr2D: false,
            isFunc: false,
            funcParams: [],
            isConst: false,
            isConstWithVal: false,
            constDataAssigned: '',
            scope: scope,
            isValueDec: false
          };

          index += 3;
          if (state.tokenStream[index - 1].lexeme === '=') {
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              datatype: id.data_type,
              terminating_symbol: [';'],
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-loop-initialization',
                message: `loop initialization statement is invalid`,
                line: current.line,
                col: current.col
              });
              return { next_index: null, result: false }
            }

            index = next_index + 1;
            id.isValueDec = true;
          }
          console.log('pushing array init dec: ', id);
          state.declaredIDs.push({...id})
          console.log("loop init pushed", state.declaredIDs);
        } else if (current.lexeme === ';') {
          index += 1;
          console.log("no init loop detected");
        }

        // check expression
        console.log("evaluating loop condition")
        const exprResult = await dispatch("CHECK_EXPRESSION", {
          starting_index: index,
          datatype: 'boolean',
          scope: scope,
          terminating_symbol: [';']
        })

        if (!exprResult.next_index) {
          commit("ADD_ERROR", {
            type: 'SEM',
            code: 'invalid-loop-condition',
            message: `loop conditional statement is invalid`,
            line: current.line,
            col: current.col
          });
          return { next_index: null, result: false }
        }

        index = exprResult.next_index + 1;

        // check count expression
        console.log('evaluating count expression')
        const countExprResult = await dispatch("CHECK_EXPRESSION", {
          starting_index: index,
          datatype: 'number',
          scope: scope,
          terminating_symbol: [')']
        });

        if (!countExprResult.next_index) {
          commit("ADD_ERROR", {
            type: 'SEM',
            code: 'invalid-loop-count-expression',
            message: `loop count expression is invalid`,
            line: current.line,
            col: current.col
          });
          return { next_index: null, result: false }
        }

        index = countExprResult.next_index;

        return {
          next_index: index,
          result: true
        }
      }

    },
    async CHECK_SIZE({ state, commit, dispatch }, { starting_index, scope }) {
      let index = starting_index;
      let current = state.tokenStream[index];
      let next = state.tokenStream[index + 1];
      let stoppers = [...state.stoppers, ')'];

      while(!stoppers.includes(current.lexeme)) {
        if (current.lexeme === 'size') {
          index += 1;
          continue;
        } else if (current.lexeme === '(') {
          index += 1;
          continue;
        } else if (current.lexeme === ')') {
          return {
            next_index: index,
            result: true
          }
        } else if (current.lexeme === '['){
          const { next_index, isArr, isArr2D } = await dispatch("CHECK_ARR_EXPRESSION", {
            starting_index: index,
            datatype: 'any',
            terminating_symbol: [')'],
            scope: scope
          });

          if (!next_index) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-size-func-param',
              message: `size() function only accepts an array literal or a string expression`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null, result: false, isArr, isArr2D
            }
          }
        } else {
          const { next_index } = await dispatch("CHECK_EXPRESSION", {
            starting_index: index,
            datatype: 'any',
            terminating_symbol: [')', [...state.stoppers]],
            scope: scope
          });

          if (!next_index) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-size-func-param',
              message: `size() function only accepts an array literal or a string expression`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null, result: false, isArr: false, isArr2D: false
            }
          }

          index = next_index;
          return { next_index, result: true, isArr: false, isArr2D: false }
        }
      }
    }
  }
}