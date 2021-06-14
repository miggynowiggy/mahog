<template>
  <v-container fluid py-10 fill-height>
    <v-dialog v-model="showAlert" max-width="400px" max-height="400px">
      <v-card>
        <v-card-title :class="[ alertType === 'error' ? 'font-weight-bold error white--text text-center' : 'font-weight-bold success white--text text-center' ]">
          {{ alertType.toUpperCase() }}
        </v-card-title>
        <v-card-text class="pa-4 my-4 text-center text-subtitle-1" v-html="alertMessage">
        </v-card-text>
        <v-card-actions class="mx-2">
          <v-btn @click="showAlert = !showAlert" :color="alertType" depressed rounded dark block>
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row align="start" justify="space-around" class="pa-2">
      <!-- The code editor on the left -->
      <v-col xs="12" sm="12" md="6" lg="6" cols="6">
        <v-row row wrap>
          <!-- The run, stop, clear button in the middle -->
          <v-col cols="12" align-self="start">
            <v-row align="center" justify="start" wrap>
              <v-col cols="1" align="center">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :icon="$vuetify.breakpoint.mdAndUp"
                      :block="$vuetify.breakpoint.smAndDown"
                      :loading="playLoading"
                      dark
                      x-large
                      color="success"
                      v-bind="attrs"
                      v-on="on"
                      @click="runCode"
                    >
                      <v-icon x-large>play_circle_filled</v-icon>
                    </v-btn>
                  </template>
                  <span class="text-subtitle-1">Run Code</span>
                </v-tooltip>
              </v-col>
              <v-col cols="1" align="center">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :icon="$vuetify.breakpoint.mdAndUp"
                      :block="$vuetify.breakpoint.smAndDown"
                      dark
                      x-large
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click="stopCode"
                    >
                      <v-icon x-large>cancel</v-icon>
                    </v-btn>
                  </template>
                  <span class="text-subtitle-1">Stop Code</span>
                </v-tooltip>
              </v-col>
              <v-col cols="1" align="center">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :icon="$vuetify.breakpoint.mdAndUp"
                      :block="$vuetify.breakpoint.smAndDown"
                      dark
                      large
                      color="accent"
                      v-bind="attrs"
                      v-on="on"
                      @click="clearEditor"
                    >
                      <v-icon large>backspace</v-icon>
                    </v-btn>
                  </template>
                  <span class="text-subtitle-1">Clear Code Editor</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <codemirror
              @cursorActivity="highlight"
              ref="codeEditor"
              v-model="code"
              :options="cmOptions"
              class="elevation-24"
            />
          </v-col>
        </v-row>
      </v-col>

      <!-- Lexeme Table and Errors Table -->
      <v-col xs="12" sm="12" md="5" lg="5" cols="5">
        <v-row align="center" justify="center" wrap>
          <v-col cols="12">
            <v-card height="auto" class="pa-2" elevation="13">
              <v-card-title class="text-h4 font-weight-bold primary--text">
                Lexeme Table
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="lexemeHeader"
                  :items="lexemes"
                  :items-per-page="10"
                  no-data-text="Press 'Run' to see the tokens..."
                  disable-sort
                  dense
                ></v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card height="auto" class="pa-2" elevation="13">
              <v-card-title class="text-h4 font-weight-bold primary--text">
                <v-badge
                  :content="errors.length"
                  :value="errors.length"
                  color="error"
                  overlap
                  offset-x="-10"
                >
                  Errors
                </v-badge>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="errorHeaders"
                  :items="errors"
                  :items-per-page="5"
                  disable-sort
                  dense
                  no-data-text="No errors..."
                ></v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { code2, code3 } from './sampleCodes';
import { codemirror, CodeMirror } from 'vue-codemirror';

require("codemirror/addon/mode/simple.js");

import "codemirror/lib/codemirror.css";
import "codemirror/theme/mbo.css";
import "codemirror/addon/display/fullscreen.css";
import "codemirror/addon/scroll/simplescrollbars.css";

import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/lint/lint";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/selection/active-line";
import "codemirror/addon/display/fullscreen";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/search/search";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/display/placeholder";
import "codemirror/addon/comment/comment";

CodeMirror.defineSimpleMode("mahog", {
  start: [
    { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
    { regex: /'(?:\\['\\rn]|[^'\\\n])*?'/, token: "string"},
    {
      regex: /(?:seed|number|string|boolean|stone|object|num|str|bol|if|elif|else|carve|water|cycle|during|skip|break|return|trim|size|void|absorb|insert|uproot|atChar|atPos)\b/,
      token: "keyword"
    },
    { regex: /null|true|false/, token: "atom" },
    {
      regex: /[~]?(?:\d+\.?\d*)/i,
      token: "number"
    },
    { regex: /[-+\/*%&|=<>!]+/, token: "operator" },
    { regex: /[a-z\_0-9A-Z$]+[\w$]*/, token: "variable" },

    { regex: /\@\?/, token: "comment", next: "comment" },
    { regex: /\@.*/, token: "comment "},

  ],
  comment: [
    { regex: /.*\?\@/, token: "comment", next: "start" },
    { regex: /.*/, token: "comment"}
  ],
  meta: { dontIndentStates: ["comment"], lineComment: "@"}
})

export default {
  name: "Code",
  components: { codemirror },
  data() {
    const self = this;
    return {
      code: code2,
      cmOptions: {
        tabSize: 2,
        theme: "mbo",
        mode: "mahog",
        lineNumbers: true,
        line: true,
        autofocus: true,
        lineWiseCopyCut: true,
        autoCloseBrackets: {
          pairs: `(){}[]||""''&&`,
          explode: "[]{}()"
        },
        matchBrackets: true,
        styleActiveLine: true,
        scrollbarStyle: "overlay",
        lint: true,
        dragDrop: false,
        extraKeys: {
          "Ctrl-S" : () => self.saveChanges(),
          "Cmd-S" : () => self.saveChanges(),
          "Ctrl-O": () => self.openFile(),
          "Cmd-O": () => self.openFile(),
          "Ctrl-R": () => self.runCode(),
          "Cmd-R": () => self.runCode(),
          "Ctrl-/": (cm) => cm.execCommand("toggleComment"),
          "Cmd-/": (cm) => cm.execCommand("toggleComment"),
          Tab: (cm) => cm.replaceSelection("  ", "end")
        }
      },
      cmCursorPos: {
        line: 1,
        ch: 0
      },
      playLoading: false,
      lexemeHeader: [
        { text: "Line", align: "left", sortable: "false", value: "line" },
        { text: "Lexeme", align: "left", sortable: "false", value: "lexeme" },
        {
          text: "Token",
          align: "left",
          sortable: "false",
          value: "token",
        },
        {
          text: "Description",
          align: "center",
          sortable: false,
          value: "description"
        }
      ],
      errorHeaders: [
        { text: "Error Type", align: "left", sortable: "false", value: "type" },
        { text: "Code", align: "left", sortable: "false", value: "code" },
        { text: "Message", align: "center", sortable: "false", value: "message" },
        { text: "Line", align: "center", sortable: "false", value: "line" },
        { text: "Col", align: "center", sortable: "false", value: "col" },
      ],
      alertType: '',
      alertMessage: '',
      showAlert: false
    }
  },
  methods: {
    highlight(cursor) {
      const { ch, line } = cursor.getCursor();
      this.cmCursorPos = Object.assign({}, this.cmCursorPos, {
        ch,
        line: line + 1
      });
    },
    clearEditor() {
      this.code = "";
      this.clearState();
    },
    clearState() {
      this.$store.commit("lexical/CLEAR_TOKENS");
      this.$store.commit("tokenizer/CLEAR_STREAM");
      this.$store.commit("lexical/CLEAR_ERRORS");
      this.$store.commit("syntax/CLEAR_ERRORS");
    },
    stopCode() {
      this.playLoading = false;
    },
    displayAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.showAlert = true;
    },
    saveChanges() {
      this.displayAlert('success', 'You unlocked a secret command: SAVE!');
    },
    openFile() {
      this.displayAlert('success', 'You unlocked a secret command: OPEN FILE!');
    },
    async runCode() {
      if (!this.code) return;
      this.playLoading = true;
      console.clear();
      this.clearState();

      const lexerSuccess = await this.$store.dispatch("lexical/ANALYZE", this.code);
      await this.$store.dispatch('tokenizer/CONVERT_TO_SYMBOL');

      const lexicalErrors = this.$store.getters['lexical/errors'];
      if (!lexerSuccess || lexicalErrors.length) {
        this.playLoading = false;
        this.displayAlert('error', 'Error/s found!<br />Please check the Errors Table for details...');
        return;
      }

      await this.$store.dispatch("syntax/ANALYZE");
      const syntaxErrors = this.$store.getters['syntax/errors'];
      if (syntaxErrors.length) {
        this.playLoading = false;
        // this.displayAlert('error', 'Error/s found!<br />Please check the Errors Table for details...');
        return;
      }

      this.playLoading = false;
      this.displayAlert('success', 'Run success!<br />No errors found!');
    },
  },
  computed: {
    lexemes() {
      return this.$store.getters["tokenizer/tokens"];
    },
    errors() {
      const lexicalErrors = this.$store.getters['lexical/errors'];
      const syntaxErrors = this.$store.getters['syntax/errors'];
      return [...lexicalErrors, ...syntaxErrors];
    },
  },
  watch: {
    code(val) {
      if (!val) {
        this.clearState();
      }
    },
  },
};
</script>

<style>
  .CodeMirror {
    height: 75vh;
    border-radius: 5px;
  }
</style>
