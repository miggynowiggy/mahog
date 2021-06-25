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
    allowedTokensInExpr: {
      "number": [
        'greaterThanOp', 'lessThanOp', 'greaterThanEqualOp', 'lessThanEqualOp', 'notEqualOp',
        'equalToOp', 'notOp', 'andOp', 'orOp', 'addOp', 'subtractOp', 'multiplyOp', 'divideOp',
        'moduloOp', 'LParen', 'RParen', 'true', 'false', 'numLit', 'negNumLit',
        'floatNumLit', 'negaFloatNumLit', 'comma', 'LSqr', 'RSqr'
      ],
      "string": ["addOp", "stringLit", 'LParen', 'RParen', 'LSqr', 'RSqr', 'comma'],
      "boolean": [
        'greaterThanOp', 'lessThanOp', 'greaterThanEqualOp', 'lessThanEqualOp', 'notEqualOp',
        'equalToOp', 'notOp', 'andOp', 'orOp', 'addOp', 'subtractOp', 'multiplyOp', 'divideOp',
        'moduloOp', 'LParen', 'RParen', 'true', 'false', 'numLit', 'negNumLit',
        'floatNumLit', 'negaFloatNumLit', 'stringLit', 'comma', 'LSqr', 'RSqr'
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
          const isIdDeclared = state.declaredIDs.find(id => id.name === next.lexeme);
          const isIdFuncDec = tokenStreamCopy[index + 2].lexeme === '(';

          const allowedFuncDataTypes = ['stone', 'number', 'string', 'boolean', 'void'];
          if (allowedFuncDataTypes.includes(current.token) && !isIdDeclared) {
            console.log("getting variable and function declaration: ", current.lexeme, next.lexeme);
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
              scope: ''
            };

            // for constant declaration
            if (current.token === 'stone') {
              console.log('getting constant declaration: ', current.lexeme, next.lexeme);
              id.isConst = true;
              if (tokenStreamCopy[index + 2].lexeme === '=') {
                id.isConstWithVal = true;
                const { next_index, data_type } = await dispatch("CHECK_STONE_EXPRESSION", {
                  starting_index: index + 3,
                  scope: functionEncountered.name
                });
                id.constDataAssigned = data_type;
                index = next_index;
              } else {
                id.isConstWithVal = false;
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
                    properties: []
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

              id.funcParams = funcParams;
              id.scope = 'global';
              console.log('pushing func: ', id);
              functionEncountered = id;
              state.declaredIDs.push(id);
              console.log("declared id ins funct: ", state.declaredIDs);
            }

            // for assigning an array literal or non-array expression
            else if (!isIdFuncDec && tokenStreamCopy[index + 2].lexeme === '=') {
              const result = await dispatch("CHECK_EXPRESSION", {
                starting_index: index + 3,
                data_type: id.data_type,
                terminating_symbol: ';',
                scope: functionEncountered.name
              });

              if (!result.next_index) {
                stop = true;
                return;
              }

              index = result.next_index;
              id.isArr = result.is_arr;
              id.isArr2D = result.is_arr_2d
              id.scope = functionEncountered.name;
              state.declaredIDs.push(id);
              console.log('declared id: ', state.declaredIDs);
            }
            
            // for variable declaration with no values
            else if (tokenStreamCopy[index + 2].lexeme === ';'){
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
              scope: functionEncountered.name
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
                const { next_index, is_arr, is_arr_2d } = await dispatch("CHECK_EXPRESSION", {
                  starting_index: index + 1,
                  data_type: prop.data_type,
                  terminating_symbol: ',',
                  scope: functionEncountered.name
                });

                if (!next_index) {
                  stop = true;
                  return;
                }

                index = next_index;
                prop.isArr = is_arr;
                prop.isArr2D = is_arr_2d;
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

        else if (current.lexeme === 'during' || current.lexeme === 'if' || current.lexeme === 'elif' || current.lexeme === 'cycle') {
          nonFunctionBlock = true;
          index += 1;
          continue;
        }
        else if (nonFunctionBlock && current.lexeme === '}') {
          nonFunctionBlock = false;
          index += 1;
          continue;
        }
        // change the scoping of the variables if the closing tag for function is found
        else if (current.lexeme === '}' && next.lexeme !== ';' && functionEncountered.name !== 'global') {
          functionEncountered = { name: 'global' };
        }
        // check the return value of a function, not the return on the global scope
        else if (!nonFunctionBlock && functionEncountered.name !== 'global' && current.lexeme === 'return') {
          console.log('return encountered: ', functionEncountered.name);
          index += 1;
          const { next_index } = await dispatch("CHECK_EXPRESSION", {
            starting_index: index,
            data_type: functionEncountered.data_type,
            terminating_symbol: ';',
            scope: functionEncountered.name
          });

          if (!next_index) {
            stop = true;
            return;
          }

          index = next_index;
        }

        // unreachable???
        // size function parameters
        else if (current.token === 'size') {
          index += 2;
          // if the size parameter is detected as an expression then evaluate the expression
          const isTokenStrOrArr = tokenStreamCopy[index].token === 'stringLit' || tokenStreamCopy[index].token.includes("id-");
          if (isTokenStrOrArr && state.stoppers.includes(tokenStreamCopy[index + 1].lexeme)) {
            const { next_index, is_arr, is_arr_2d } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index,
              terminating_symbol: ')',
              data_type: 'string',
              scope: functionEncountered.name
            })

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-size-func-parameter',
                message: `the supplied expression on size function is not a string value or an array literal`,
                line: current.line,
                col: current.col
              });
              stop = true;
              return;
            }

            index = next_index
          }
          else if (tokenStreamCopy[index].token.includes('id-') && !state.stoppers.includes(tokenStreamCopy[index + 1].lexeme)) {
            const id = state.declaredIDs.find(i => i.name === tokenStreamCopy[index].lexeme && (i.scope === functionEncountered.name || i.scope === 'global'));

            if (!id) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'undeclared-variable',
                message: `Undeclared variable -> [ ${tokenStreamCopy[index].lexeme} ]`,
                line: current.line,
                col: current.col
              });
              stop = true;
              return;
            }
            else if (id && (!id.isArr || id.data_type !== 'string')) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-size-func-parameter',
                message: `Variable [ ${id.name} ] does not contain a string value nor an array literal`,
                line: current.line,
                col: current.col
              });
              stop = true;
              return;
            }
          }
          else if (tokenStreamCopy[index].token !== 'stringLit' && !state.stoppers.includes(tokenStreamCopy[index + 1].lexeme)) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-size-func-parameter',
              message: `[ ${tokenStreamCopy[index].lexeme} ] is not allowed as a parameter to size function.`,
              line: current.line,
              col: current.col
            });
            stop = true;
            return;
          }
          index += 1;
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
    async CHECK_EXPRESSION({ state, commit, dispatch }, details) {
      const { starting_index, data_type, terminating_symbol, scope } = details

      let index = starting_index;
      let current = state.tokenStream[index];
      let next = state.tokenStream[index + 1];

      let isExprArr = false;
      let isArr2D = false;

      // determine if the expression is an array by checking the first token of the expression
      if (current.lexeme === '[') {
        console.log('checking array content: ', current.lexeme);
        isExprArr = true;
        let arr2DOpening = false;
        let arr2DComplete = false;

        index += 1;
        current = state.tokenStream[index];
        let stop = false;
        while (!stop) {
          console.log('checking array content: ', current.lexeme);
          // the arr literal is 2d if another [ is encountered
          if (current.lexeme === '[') {
            console.log('2d arr found')
            isArr2D = true;
            arr2DOpening = true;
            arr2DComplete = false;
            index += 1;
          }
          // acknowledge that the inner array has been completed
          else if (arr2DOpening && current.lexeme === ']') {
            console.log('2d arr closed')
            arr2DComplete = true;
            arr2DOpening = false;
            index += 1;
          }
          // terminate the checking if the outer array has been closed
          else if (arr2DComplete && current.lexeme === ']' && terminating_symbol.includes(next.lexeme)) {
            stop = true;
            console.log('dapat tapos na')
            return {
              next_index: index,
              is_arr: isExprArr,
              is_arr_2d: isArr2D
            }
          }
          // terminate checking if the array content has been evaluated
          else if (!isArr2D && current.lexeme === ']') {
            console.log('dapat tapos na')
            stop = true;
            return {
              next_index: index ,
              is_arr: isExprArr,
              is_arr_2d: isArr2D
            }
          }
          // check if string literal has a string atPos method
          else if (current.token === 'stringLit' && state.tokenStream[index + 1].lexeme === '.' && state.tokenStream[index + 2].token === 'atPos') {
            if (data_type !== 'string') {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'value-data-type-mismatch',
                message: `[ ${current.lexeme}.atPos() ] contains a non-${data_type} value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                is_arr: isExprArr,
                is_arr_2d: isArr2D
              }
            }

            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index + 4,
              terminating_symbol: ')',
              data_type: 'number',
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-atPos-parameter',
                message: `atPos() string method was supplied with a non-numeric value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                is_arr: isExprArr,
                is_arr_2d: isArr2D
              }
            }

            index = next_index;
          }
          // check if string literal has a string atChar method
          else if (current.token === 'stringLit' && state.tokenStream[index + 1].lexeme === '.' && state.tokenStream[index + 2].token === 'atChar') {
            if (data_type !== 'number' && data_type !== 'boolean') {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'value-data-type-mismatch',
                message: `[ ${current.lexeme}.atChar() ] contains a non-${data_type} value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                is_arr: isExprArr,
                is_arr_2d: isArr2D
              }
            }

            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index + 4,
              terminating_symbol: ')',
              data_type: 'string',
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-atChar-parameter',
                message: `atChar() string method was supplied with a non-string value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                is_arr: isExprArr,
                is_arr_2d: isArr2D
              }
            }

            index = next_index;
          }
          // determine if the id contains valid data
          else if (current.token.includes("id-")) {
            const { next_index, result } = await dispatch("CHECK_ID", {
              starting_index: index,
              data_type: data_type,
              scope: scope
            });

            if (!result) {
              return {
                next_index: null,
                is_arr: isExprArr,
                is_arr_2d: isArr2D
              }
            }

            index = next_index;
          }
          // determine if the the ids or literals in the expression is allowed
          else if (!state.allowedTokensInExpr[String(data_type)] && state.allowedTokensInExpr[String(data_type)].includes(current.token)) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'value-data-type-mismatch',
              message: `Operand [ ${current.lexeme} ] contains a non-${data_type} value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              is_arr: isExprArr,
              is_arr_2d: isArr2D
            }
          }
          // just iterate if none is found
          else {
            index += 1;
          }

          current = state.tokenStream[index];
          next = state.tokenStream[index + 1];
        }

      } else {
        while(!terminating_symbol.includes(current.lexeme)) {
          console.log('checking non-array expression: ', current.lexeme);
          const isTokenValid = state.allowedTokensInExpr[String(data_type)] && state.allowedTokensInExpr[String(data_type)].includes(current.token);

          if (current.token.includes('id-')) {
            console.log("checking ID in expr: ", data_type)
            const { next_index, result } = await dispatch("CHECK_ID", {
              starting_index: index,
              data_type: data_type,
              scope: scope
            });

            if (!result) {
              return {
                next_index: null,
                is_arr: isExprArr,
                is_arr_2d: isArr2D
              };
            } else {
              index = next_index;
            }

          }
          // check if the string literal has an attached string method
          else if (current.token === 'stringLit' && state.tokenStream[index + 1].lexeme === '.' && state.tokenStream[index + 2].lexeme === 'atPos') {
            if (data_type !== 'string') {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'value-data-type-mismatch',
                message: `[ ${current.lexeme}.atPos() ] contains a non-${data_type} value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                is_arr: isExprArr,
                is_arr_2d: isArr2D
              }
            }

            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index + 4,
              terminating_symbol: [')'],
              data_type: 'number',
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-atPos-parameter',
                message: `atPos() string method was supplied with a non-numeric value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                is_arr: isExprArr,
                is_arr_2d: isArr2D
              }
            }

            index = next_index;
          }
          // check if the string literal has an attached string method
          else if (current.token === 'stringLit' && state.tokenStream[index + 1].lexeme === '.' && state.tokenStream[index + 2].lexeme === 'atChar') {
            if (data_type !== 'number' && data_type !== 'boolean') {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'value-data-type-mismatch',
                message: `[ ${current.lexeme}.atChar() ] contains a non-${data_type} value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                is_arr: isExprArr,
                is_arr_2d: isArr2D
              }
            }

            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index + 4,
              terminating_symbol: [')'],
              data_type: 'string',
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-atChar-parameter',
                message: `atChar() string method was supplied with a non-numeric value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                is_arr: isExprArr,
                is_arr_2d: isArr2D
              }
            }

            index = next_index;
          }

          // else if(current.token === 'size'){
          //   console.log("checking parameter in expr: ", data_type);
          //   let functionEncountered = { name: 'global', data_type: '' };
          //   index += 2;
          //   // if the size parameter is detected as an expression then evaluate the expression
          //   const isTokenStrOrArr = state.tokenStream[index].token === 'stringLit' || state.tokenStream[index].token.includes("id-");
          //   console.log(isTokenStrOrArr);
          //   if(state.tokenStream[index].token.includes('id-')){
          //     const { next_index, is_arr, is_arr_2d } = await dispatch("CHECK_EXPRESSIONS", {
          //       starting_index: index,
          //       terminating_symbol: ')',
          //       data_type: state.declaredIDs.find(i => i.name === state.tokenStream[index].lexeme && (i.scope === functionEncountered.name || i.scope === 'global')).data_type,
          //       scope: functionEncountered.name
          //     })

          //   }
          //   if(state.tokenStream[index].token === 'stringLit'){
          //     console.log('hays');
          //   }
          //   if (isTokenStrOrArr && state.stoppers.includes(state.tokenStream[index+1].lexeme)) {
          //     const { next_index, is_arr, is_arr_2d } = await dispatch("CHECK_EXPRESSION", {
          //       starting_index: index,
          //       terminating_symbol: ')',
          //       data_type: data_type,
          //       scope: functionEncountered.name
          //     })
          //     if (!next_index) {
          //       commit("ADD_ERROR", {
          //         type: 'SEM',
          //         code: 'invalid-size-func-parameter',
          //         message: `the supplied expression on size function is not a string value`,
          //         line: current.line,
          //         col: current.col
          //       });
          //       // stop = true;
          //       return;
          //     }

          //     index = next_index
          //   }
          //   else if (state.tokenStream[index].token.includes('id-') && state.stoppers.includes(state.tokenStream[index + 1].lexeme)) {
          //     const id = state.declaredIDs.find(i => i.name === state.tokenStream[index].lexeme && (i.scope === functionEncountered.name || i.scope === 'global'));
          //     // console.log(id);
          //     if (!id) {
          //       commit("ADD_ERROR", {
          //         type: 'SEM',
          //         code: 'undeclared-variable',
          //         message: `Undeclared variable -> [ ${state.tokenStream[index].lexeme} ]`,
          //         line: current.line,
          //         col: current.col
          //       });
          //       // stop = true;
          //       return;
          //     }
          //     else if (id && (!id.isArr || id.data_type !== 'string')) {
          //       commit("ADD_ERROR", {
          //         type: 'SEM',
          //         code: 'invalid-size-func-parameter',
          //         message: `Variable [ ${id.name} ] does not contain a string value`,
          //         line: current.line,
          //         col: current.col
          //       });
          //       // stop = true;
          //       return;
          //     }
          //   }
          //   else if (state.tokenStream[index+1].token !== 'stringLit' && !state.stoppers.includes(state.tokenStream[index + 2].lexeme)) {
          //     commit("ADD_ERROR", {
          //       type: 'SEM',
          //       code: 'invalid-size-func-parameter',
          //       message: `[ ${state.tokenStream[index+1].lexeme} ] is not allowed as a parameter to size function.`,
          //       line: current.line,
          //       col: current.col
          //     });
          //     // stop = true;
          //     return;
          //   }
          //   index += 1;
          // }

          else if (!isTokenValid) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'value-data-type-mismatch',
              message: `Operand [ ${current.lexeme} ] contains a non-${data_type} value.`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              is_arr: isExprArr,
              is_arr_2d: isArr2D
            };

          } else {
            index += 1;
          }

          current = state.tokenStream[index];
          next = state.tokenStream[index + 1];
        }

        return {
          next_index: index,
          is_arr: isExprArr,
          is_arr_2d: isArr2D
        };
      }

    },
    async CHECK_STONE_EXPRESSION({ state, commit, dispatch }, details) {
      let index = details.starting_index;
      let current = state.tokenStream[index];
      let scope = details.scope;

      let initialDataType = null;
      while(current.lexeme !== ';') {
        console.log(initialDataType);
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

        index += 1;
        current = state.tokenStream[index];
      }

      return {
        next_index: index,
        data_type: initialDataType
      }
    },
    async CHECK_ID({ state, commit, dispatch }, { starting_index, data_type, scope }) {
      let index = starting_index;
      let current = state.tokenStream[index];
      let next = state.tokenStream[index + 1];

      const stoppers = ['+', '-', '*', '/', '%', '+=', '-=', '*=', '/=', '%=', '>', '<', '>=', '<=', "!=", '==', '||', '&&', ';', ',', ']'];

      while(!stoppers.includes(current.lexeme)) {
        // check if the id is a function call
        if (current.token.includes('id-') && next.lexeme === '(') {
          const id = state.declaredIDs.find(id => id.name === current.lexeme && (id.scope === scope || id.scope === 'global'));
          console.log('function call encountered: ', id);

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

          // check if the id was declared as a function
          else if (id && !id.isFunc) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-function-call',
              message: `Variable [ ${current.lexeme} ] is not a function.`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          // if function is found in a wrong data type
          else if(data_type !== id.data_type){
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'value-data-type-mismatch',
              message: `Operand [ ${current.lexeme} ] contains a non-${data_type} value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          index += 2;

          // gather the parameters that needs analysis
          const paramList = [];
          const param = { indexes: [], terminating_symbol: '' };
          let isParenEncountered = false;

          // determine the index of the first operands of the parameter
          while (true) {
            current = state.tokenStream[index];
            next = state.tokenStream[index + 1];

            if (current.lexeme === ',') {
              param.terminating_symbol = current.lexeme;
              paramList.push({ ...param });
              param.indexes = [];
              isParenEncountered = false;

            }
            else if (current.lexeme === '(') {
              isParenEncountered = true;
              param.indexes.push(index)
            }
            else if (isParenEncountered && current.lexeme === ')') {
              isParenEncountered = false;
              param.indexes.push(index)
            }
            else if (!isParenEncountered && current.lexeme === ')') {
              param.terminating_symbol = current.lexeme;
              paramList.push({ ...param });
              param.indexes = [];
              isParenEncountered = false;
              index += 1;
              break;
            }
            else {
              param.indexes.push(index);
            }

            index += 1;
          }

          if (paramList.length !== id.funcParams.length) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'mismatched-function-param-count',
              message: `Function [ ${id.name} ] expects ${id.funcParams.length} parameter/s, provided ${paramList.length}`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          for(let loopIndex = 0; loopIndex < paramList.length; loopIndex++) {
            console.log('checking for param: ', id.funcParams[loopIndex]);
            console.log('checking param: ', paramList[loopIndex]);

            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: paramList[loopIndex].indexes[0],
              data_type: id.funcParams[loopIndex].data_type,
              terminating_symbol: paramList[loopIndex].terminating_symbol,
              scope: id.scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'value-data-type-mismatch',
                message: `Data type mismatch on function parameter [ ${id.funcParams[loopIndex].name} ] of function [ ${id.name} ]`,
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

          return {
            next_index: index + 1,
            result: true
          }
        }

        // if the id is appended with a string method, check if it is valid
        else if (current.token.includes('id-') && next.lexeme === '.' && state.tokenStream[index + 2].token === 'atPos') {
          const id = state.declaredIDs.find(i => i.name === current.lexeme && (i.scope === scope || i.scope === 'global'));
          console.log('checking atPos: ', id);

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

          // throw an error is the variable is not holding a string value
          else if (id && id.data_type !== 'string') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-atPos-usage',
              message: `variable [ ${id.name} ] does not hold a string literal value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          // check if the supplied parameter for atPos is a numeric value
          index += 4;
          const { next_index } = await dispatch("CHECK_EXPRESSION", {
            starting_index: index,
            terminating_symbol: [';', ')'],
            data_type: 'number',
            scope: scope
          });

          if (!next_index) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-atPos-parameter',
              message: `atPos() string method was supplied with a non-numeric value`,
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

        // if the id is appended with a string method, check if it is valid
        else if (current.token.includes('id-') && next.lexeme === '.' && state.tokenStream[index + 2].token === 'atChar') {
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
          }

          // check if the data holds a string data type
          else if (id && (id.data_type !== 'string' || id.isArr)) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-atChar-usage',
              message: `variable [ ${id.name} ] does not hold a string literal value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          // check if the supplied parameter for atChar is a numeric value
          index += 3;
          const { next_index } = await dispatch("CHECK_EXPRESSION", {
            starting_index: index,
            terminating_symbol: [')', ...state.stoppers],
            data_type: 'number',
            scope: scope
          });

          if (!next_index) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-atChar-parameter',
              message: `atChar() string method was supplied with a non-string value`,
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

        // check if the id is an object access
        else if (current.token.includes('id-') && next.lexeme === '.') {
          const id = state.declaredIDs.find(id => id.name === current.lexeme && (id.scope === scope || id.scope === 'global'));
          console.log("object detected: ", id);

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

          // advance the pointer to the id after the period symbol
          index += 2;
          current = state.tokenStream[index];
          next = state.tokenStream[index + 1];

          // check if the property is not an array access
          if (current.token.includes("id-") && next.lexeme !== '[') {
            const isPropsPresent = id.properties.find(prop => prop.name === current.lexeme);
            console.log("object property: ", isPropsPresent);

            if (!isPropsPresent) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'undeclared-object-property',
                message: `Property [ ${current.lexeme} ] is not a declared property in object [ ${id.name} ]`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              };
            }

            else if (isPropsPresent && isPropsPresent.isArr) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'value-data-type-mismatch',
                message: `[ ${id.name}.${isPropsPresent.name} ] contains an array value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              };
            }

            else if (isPropsPresent && isPropsPresent.data_type !== data_type && !isPropsPresent.isArr) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'value-data-type-mismatch',
                message: `[ ${id.name}.${isPropsPresent.name} ] contains a non-${data_type} value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              };
            }

            return {
              next_index: index + 1,
              result: true
            };
          }

          else if (current.token.includes("id-") && next.lexeme === '[') {
            const isPropsPresent = id.properties.find(prop => prop.name === current.lexeme);
            if (!isPropsPresent) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'undeclared-object-property',
                message: `[ ${isPropsPresent.name} ] is not a declared property on object [ ${id.name} ]`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              }
            }

            // throw an error if the property is not an array and is being accessed like an array
            else if (isPropsPresent && !isPropsPresent.isArr) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-array-usage',
                message: `[ ${id.name}.${isPropsPresent.name} ] is does not contain an array value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              }
            }

            // check if the array index is a valid arithmetic expression
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index + 2,
              terminating_symbol: [']'],
              data_type: 'number',
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-array-index',
                message: `[ ${id.name}.${isPropsPresent.name}[] ] is supplied a non-numeric index`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              };
            }

            // check if the array is 2d
            index = next_index;
            if (isPropsPresent.isArr && !isPropsPresent.isArr2D && state.tokenStream[index].lexeme === '[') {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-array-usage',
                message: `[ ${id.name}.${isPropsPresent.name} ] is not a 2-dimensional array`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              };
            }

            // if the second index is supplied, check the index if its a valid arithmetic expression
            else if (isPropsPresent.isArr && isPropsPresent.isArr2D && state.tokenStream[index].lexeme === '[') {
              const { next_index } = await dispatch("CHECK_EXPRESSION", {
                starting_index: index + 1,
                terminating_symbol: [']'],
                data_type: 'number',
                scope: scope
              });

              if (!next_index) {
                commit("ADD_ERROR", {
                  type: 'SEM',
                  code: 'invalid-array-index',
                  message: `[ ${id.name}.${isPropsPresent.name} ] is supplied with a non-numeric index`,
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

            // Throw an error if the array element does not match the intended data type
            if (isPropsPresent.data_type !== data_type) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'value-data-type-mismatch',
                message: `Object property [ ${id.name}.${isPropsPresent.name} ] contains a non-${data_type} value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              };
            }

            return {
              next_index: next_index + 1,
              result: true
            };
          }

          index += 1;
        }

        // check if the id is an array access
        else if (current.token.includes("id-") && next.lexeme === '[') {
          const id = state.declaredIDs.find(i => i.name === current.lexeme && (i.scope === scope || i.scope === 'global'));
          console.log('array access: ', id);

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
            }
          }

          // Throw an error if the id does not contain an array literal, but array acceess is being used on it.
          else if (id && !id.isArr) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'undeclared-variable',
              message: `Variable [ ${current.lexeme} ] is not a valid array variable`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            }
          }

          // check if expression inside the array access is a valid arithmetic expression
          const { next_index } = await dispatch("CHECK_EXPRESSION", {
            starting_index: index + 2,
            data_type: 'number',
            terminating_symbol: [']'],
            scope: scope
          });

          if (!next_index) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-array-usage',
              message: `[ ${id.name} ] is supplied with a non-numeric index`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            }
          }

          index = next_index + 1;
          console.log(state.tokenStream[index].lexeme)
          if (id.isArr2D && state.tokenStream[index].lexeme === '[') {
            const { next_index } = await dispatch("CHECK_EXPRESSION", {
              starting_index: index + 1,
              terminating_symbol: [']'],
              data_type: 'number',
              scope: scope
            });

            if (!next_index) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'invalid-array-usage',
                message: `[ ${id.name} ] is supplied with a non-numeric index`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              }
            }

            index = next_index;
          }
          else if (!id.isArr2D && state.tokenStream[index].lexeme === '[') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-array-usage',
              message: `[ ${id.name} ] is not a 2-dimensional array`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            }
          }

          if (id.data_type !== data_type) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'vale-data-type-mismatch',
              message: `Variable [ ${id.name} ] contains a non-${data_type} value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          }

          return {
            next_index: index + 1,
            result: true
          }
        }

        // if the id is not a function call, array access or object access
        else if (current.token.includes('id-') && next.lexeme !== '.' && next.lexeme !== '[' && next.lexeme !== '(') {
          const isIdDeclared = state.declaredIDs.find(id => id.name === current.lexeme && (id.scope === scope || id.scope === 'global'));
          console.log("only id: ", isIdDeclared);

          if (isIdDeclared && isIdDeclared.isArr) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-array-usage',
              message: `Variable [ ${current.lexeme} ] contains an array value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          } else if (isIdDeclared && isIdDeclared.data_type === 'object') {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-object-usage',
              message: `Variable [ ${current.lexeme} ] contains an object value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          } else if (isIdDeclared && isIdDeclared.data_type === 'stone') {
            if (isIdDeclared.constDataAssigned !== data_type) {
              commit("ADD_ERROR", {
                type: 'SEM',
                code: 'value-data-type-mismatch',
                message: `Variable [ ${current.lexeme} ] contains non-${data_type} value`,
                line: current.line,
                col: current.col
              });
              return {
                next_index: null,
                result: false
              };
            }
          } else if (isIdDeclared && isIdDeclared.data_type !== data_type) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'value-data-type-mismatch',
              message: `Variable [ ${current.lexeme} ] contains non-${data_type} value`,
              line: current.line,
              col: current.col
            });
            return {
              next_index: null,
              result: false
            };
          } else if (!isIdDeclared) {
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

          return {
            next_index: index + 1,
            result: true
          };
        }
        else {
          index += 1;
        }

        current = state.tokenStream[index];
        next = state.tokenStream[index + 1];
      }

      return {
        next_index: index + 1,
        result: true
      }
    },
    async CHECK_ID_EXPRESSION({ state, commit, dispatch }, { starting_index, scope, terminating_symbol }) {
      let index = starting_index;
      let current = state.tokenStream[index];
      let next = state.tokenStream[index + 1];

      let data_type = null;
      let idToAssign = null;
      let accessProp = null;
      let arrayMethods = ['absorb', 'insert', 'uproot'];
      while (current.lexeme !== ';') {
        // check if the id is an array access
        if (current.token.includes('id-') && next.lexeme === '[') {
          console.log('id expr is an array access');
          const id = state.declaredIDs.find(i => i.name === current.lexeme && (i.scope === scope || i.scope === 'global'));
          idToAssign = id;

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
            data_type: 'number',
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
              data_type: 'number',
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
              data_type: 'number',
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
                data_type: 'number',
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
        else if (current.lexeme === '=') {
          index += 1;
          const { next_index } = await dispatch("CHECK_EXPRESSION", {
            starting_index: index,
            data_type: data_type,
            terminating_symbol: [';'],
            scope: scope
          });

          if (!next_index) {
            commit("ADD_ERROR", {
              type: 'SEM',
              code: 'invalid-variable-assignment',
              message: `value being assigned to [ ${idToAssign.name}${accessProp ? '.' + accessProp.name : ''} ] is not valid`,
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
    }
  }
}