/* eslint-disable no-constant-condition */
const cloneDeep = require('lodash/cloneDeep');
// (2+3) - ((3 + 2)+4) + 3
export default {
  namespaced: true,
  state: {
    errors: [],
    tokenStream: [],
    declaredIDs: [

    ],
    newTokenStream: [],
    stoppers: [
      '+', '-', '*', '/', '%', '&&', '||', '+=', '-=', '*=', '/=', '%=',
      '!=', '==', '<', '>', '<=', '>=', ';', ',', ')', ']'
    ],
    allowedTokensInExpr: {
      "number": [
        'greaterThanOp', 'lessThanOp', 'greaterThanEqualOp', 'lessThanEqualOp', 'notEqualOp',
        'equalToOp', 'notOp', 'andOp', 'orOp', 'addOp', 'subtractOp', 'multiplyOp', 'divideOp',
        'moduloOp', 'true', 'false', 'numLit', 'negNumLit', 'floatNumLit', 'negaFloatNumLit'
      ],
      "string": ['addOp', 'stringLit'],
      "boolean": [
        'greaterThanOp', 'lessThanOp', 'greaterThanEqualOp', 'lessThanEqualOp', 'notEqualOp',
        'equalToOp', 'notOp', 'andOp', 'orOp', 'addOp', 'subtractOp', 'multiplyOp', 'divideOp',
        'moduloOp', 'true', 'false', 'numLit', 'negNumLit','floatNumLit', 'negaFloatNumLit',
        'stringLit', 'comma', 'LSqr', 'RSqr'
      ],
      "any": [
        'greaterThanOp', 'lessThanOp', 'greaterThanEqualOp', 'lessThanEqualOp', 'notEqualOp',
        'equalToOp', 'notOp', 'andOp', 'orOp', 'addOp', 'subtractOp', 'multiplyOp', 'divideOp',
        'moduloOp', 'LParen', 'RParen', 'true', 'false', 'numLit', 'negNumLit',
        'floatNumLit', 'negaFloatNumLit', 'stringLit', 'comma', 'LSqr', 'RSqr'
      ],
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
    },
    SET_TOKEN_STREAM(state, payload) {
      state.tokenStream = cloneDeep(payload);
    },
    ADD_ID(state, payload) {
      state.declaredIDs.push({...payload});
    }
  },
  actions: {
    async ANALYZE({ rootGetters, state, commit, dispatch }) {
      const ts = rootGetters['lexical/lexemes'].filter(t => t.token !== 'comment' && t.token !== 'multilineComment');
      commit("SET_TOKEN_STREAM", ts);

      const N = state.tokenStream.length;
      const empty = { token: '', line: null, col: null };

      let dataTypes = ['number', 'string', 'boolean'];
      state.declaredIDs = [];

      let index = 0;
      let funcEncounter = { name: 'global' };
      while (index < N) {
        let current = state.tokenStream[index];
        let next = index + 1 !== N ? state.tokenStream[index + 1] : empty;

        // check for data type declaration
        if (dataTypes.includes(current.lexeme)) {
          const id = {
            data_type: current.lexeme,
            name: next.lexeme,
            isArr: false,
            isArr2D: false,
            isObj: false,
            isFunc: false,
            scope: funcEncounter.name
          }

          index += 1; //advance to the id
          current = state.tokenStream[index];
          next = state.tokenStream[index + 1];

          if (next.lexeme === '=') {
            index += 2; // advance to the start of the expression to be assigned
            console.log("CHECKING EXPRESSION CONTENT OF ", id.name, ' WITH DATA TYPE ', id.data_type)
            const { next_index, isArr, isArr2D } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              data_type: id.data_type,
              scope: funcEncounter.name,
              terminating_symbol: [';']
            });

            if (!next_index) {
              return;
            }

            index = next_index;
            id.isArr = isArr;
            id.isArr2D = isArr2D;
          } else {
            index += 2;
          }

          commit("ADD_ID", id);
        } else {
          index += 1;
        }
      }
      console.table(state.declaredIDs);
    },
    async IS_ID_PRESENT({ state, commit, dispatch }, { starting_index }) {

    },
    async CHECK_ID({ state, commit, dispatch }, { starting_index, data_type, terminating_symbol, scope }) {
      const reservedMethods = ['atPos', 'atChar', 'absorb', 'insert', 'uproot'];
      let index = starting_index;
      let current = state.tokenStream[index];
      let next = state.tokenStream[index + 1];
      let stop = false;

      while (!stop) {
        // just double check if the id is id
        if (current.token.includes("id-")) {
          const id = state.declaredIDs.find(i => i.name === current.lexeme && (i.scope === scope || i.scope === 'global'));
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
          else if (id && id.data_type !== data_type && next.lexeme !== '.') {
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
          if (next.lexeme === '[') {
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
                data_type: 'number',
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
                  data_type: 'number',
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
          else if (next.lexeme === '.' && !reservedMethods.includes(state.tokenStream[index + 1])) {
            index += 1;
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
              const prop = id.properties.find(p => p.name === state.tokenStream[index]);
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
              else if (prop && prop.data_type !== data_type) {
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
                    data_type: 'number',
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
                      data_type: 'number',
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
              data_type: 'number',
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
              data_type: 'string',
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
          else if (next.lexeme === '(') {
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
              const paramList = [];
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
                  index += 1;
                  break;
                } else {
                  param.indexes.push(index);
                  index += 1;
                  current = state.tokenStream[index];
                }
              }

              if (id.parameters.length !== paramList.length) {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-function-call',
                  message: `[ ${id.name} ] was expecting ${id.parameters.length}, but supplied ${paramList.length}`,
                  line: current.line,
                  col: current.col
                });
                return { next: null, result: false }
              }

              for (let loopIndex = 0; loopIndex < parenList.length; loopIndex++) {
                const { next_index } = await dispatch("CHECK_EXPRESSION", {
                  starting_index: paramList[loopIndex].indexes[0],
                  data_type: id.parameters[loopIndex].data_type,
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
              }
            }
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
    async CHECK_ID_DATA({ state, commit, dispatch }, { starting_index, terminating_symbol }) {
      let index = starting_index;
      let current = state.tokenStream[index];

      while(!terminating_symbol.includes(current.lexeme)) {
        console.log(current.lexeme);
        index += 1;
        current = state.tokenStream[index];
      }
    },
    async CHECK_ARR_EXPRESSION({ state, commit, dispatch }, { starting_index, terminating_symbol, data_type, scope }) {
      let index = starting_index;
      let N = state.tokenStream.length;
      let current = state.tokenStream[index];
      let next = index + 1 !== N ? state.tokenStream[index + 1] : { lexeme: '', token: '', col: 0, line: 0 };

      let arrCounter = 0;
      let isArr = false;
      let isArr2D = false;
      let stop = false

      isArr = true;
      index += 1; //advance to the first element of the array
      current = state.tokenStream[index];
      next = state.tokenStream[index + 1];

      while(!stop) {
        if (!arrCounter && (terminating_symbol.includes(current.lexeme) || current.lexeme === ']')) {
          index += 1;
          stop = true;
          return {
            next_index: index, result: true, isArr, isArr2D
          };
        }
        else if (current.lexeme === '[') {
          isArr2D = true;
          arrCounter += 1;
          index += 1;
        }
        else if (isArr2D && current.lexeme === ']' && arrCounter) {
          arrCounter -= 1;
          index += 1;
        }
        else if (current.lexeme === ',') {
          index += 1;
        }
        else {
          const { next_index } = await dispatch("CHECK_EXPRESSION", {
            starting_index: index,
            data_type: data_type,
            scope: scope,
            terminating_symbol: [',', ']']
          });

          if (!next_index) {
            return {
              next_index: null, result: false, isArr, isArr2D
            }
          }

          index = next_index;
        }

        current = state.tokenStream[index];
        next = index + 1 !== N ? state.tokenStream[index + 1] : { lexeme: '', token: '', col: 0, line: 0 };
      }

      return {
        next_index: index, result: true, isArr, isArr2D
      }
    },
    async CHECK_EXPRESSION({ state, commit, dispatch }, { starting_index, terminating_symbol, data_type, scope }) {
      try {
        let index = starting_index;
        let N = state.tokenStream.length;
        let current = state.tokenStream[index];
        let next;

        let parenCounter = 0
        let isArr = false;
        let isArr2D = false;
        let stop = false;

        if (current.lexeme === '[') {
          const { next_index, isArr, isArr2D } = await dispatch("CHECK_ARR_EXPRESSION", {
            starting_index: index,
            data_type: data_type,
            terminating_symbol: [...terminating_symbol],
            scope: scope
          });

          if (!next_index) {
            return {
              next_index: null, result: false, isArr, isArr2D
            }
          }

          return {
            next_index: next_index, result: true, isArr, isArr2D
          }
        }

        while(!stop) {
          current = state.tokenStream[index];
          next = index + 1 !== N ? state.tokenStream[index + 1] : { lexeme: '', token: '', col: 0, line: 0 };
          console.log("CHECK EXPR: ", current);

          //terminating condition
          if (!parenCounter && terminating_symbol.includes(current.lexeme)) {
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
          }
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
    }
  }
}