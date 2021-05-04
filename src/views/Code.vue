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

    <v-row align="center" justify="space-around" class="pa-2">
      <!-- The code editor on the left -->
      <v-col xs="12" sm="12" md="6" lg="6" cols="6">
        <v-card height="80vh" class="pa-2" elevation="24">
          <prism-editor
            class="my-editor"
            v-model="code"
            :highlight="highlight"
            line-numbers
            autoStyleLineNumbers
          ></prism-editor>
        </v-card>
      </v-col>
      <!-- The run, stop, clear button in the middle -->
      <v-col cols="12" sm="12" md="1" lg="1">
        <v-row align="center" justify="center" wrap>
          <v-col xs="10" sm="10" md="12" lg="12" align="center">
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
          <v-col xs="10" sm="10" md="12" lg="12" align="center">
            <v-tooltip right>
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
          <v-col xs="10" sm="10" md="12" lg="12" align="center">
            <v-tooltip bottom>
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
      <!-- The two tables on the right -->
      <v-col xs="12" sm="12" md="5" lg="5" cols="5">
        <v-row align="center" justify="center" wrap>
          <!-- Lexeme table Card -->
          <v-col cols="12">
            <v-card height="auto" class="pa-2" elevation="13">
              <v-card-title class="text-h4 font-weight-bold primary--text">
                Lexeme Table
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="lexemeHeader"
                  :items="lexemeTable"
                  :items-per-page="10"
                  no-data-text="Press 'Run' to see the tokens..."
                  disable-sort
                  dense
                ></v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" wrap class="mt-5">
      <v-col cols="10">
        <!-- The Syntax Analysis Card -->
        <v-card class="pa-2" elevation="13">
          <v-card-title class="text-h4 font-weight-bold primary--text">
            Errors
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="syntaxHeader"
              :items="errorTable"
              :items-per-page="5"
              disable-sort
              dense
              no-data-text="No errors..."
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import Prism Editor
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles
const code1 = `
seed something;
seed _num = "2";
stone wawThisIsLong = 21;
number wow = 123456789.987654321;
number waw = ~12.213;
number there = ~900;
boolean isLegal = true;
names = ["Some", "Valuable", "String"];
`;

const code2 = `
seed something;
seed _num = "2";
stone wawThisIsLong = 21;
number wow = 123456789.987654321;
number waw = ~12.213;
number there = ~900;
number arr = [1,2,3];
string names = ['Alec',"Miggy","Juan miggy\\"waw\\""];
number twoD = [[1,2,3],[4,5,6],[7,8,9]];
boolean isLegal = true;
isLegal = false;

twoD.absorb([1, 3, 2]);
twoD.insert(2, [1]);
twoD.uproot();

@this is some comment

@?
multi
line-height
comments
?@

if(isOK) {
	carve("nice");
} elif(isOK && num1 == 2) {
	carve("nice nice");
} else {
	carve("nice x3");
}

cycle(number num1 = 2; isOK; num1++) {
  carve(num1);
  if(num1 == 5) {
    isOK = false;
  }
}

isOK = true;
number ctr = 0;
during(!(!isOK) || (ctr < 3)){
  carve(arr[ctr]);
  ctr--;
}

number func(number x, number y) {
  return x + y;
}

carve('hehe');

string myNum = water("Enter num: ");

object miggy = {
	string name: "Miggy",
	number age: 21,
	boolean isLegal: true,
	string subjs: ["CS", "IT", "MIS"],
};
`;

export default {
  name: "Code",
  components: { PrismEditor },
  data: () => ({
    code: code2,
    playLoading: false,
    lexemeHeader: [
      { text: "Line", align: "center", sortable: "false", value: "line" },
      { text: "Lexeme", align: "center", sortable: "false", value: "lexeme" },
      {
        text: "Token",
        align: "center",
        sortable: "false",
        value: "token",
      },
    ],
    lexemes: [],
    syntaxHeader: [
      { text: "Code", align: "left", sortable: "false", value: "code" },
      { text: "Message", align: "center", sortable: "false", value: "message" },
      { text: "Line", align: "center", sortable: "false", value: "line" },
    ],
    syntaxes: [],
    alertType: '',
    alertMessage: '',
    showAlert: false
  }),
  mounted() {
    // this.runCode();
  },
  methods: {
    highlight(code) {
      return highlight(code, languages.js);
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
    async runCode() {
      if (!this.code) return;
      this.playLoading = true;
      this.clearState();

      await this.$store.dispatch("lexical/ANALYZE", this.code);
      await this.$store.dispatch('tokenizer/CONVERT_TO_SYMBOL');

      const lexicalErrors = this.$store.getters['lexical/errors'];
      if (lexicalErrors.length) {
        this.playLoading = false;
        this.displayAlert('error', 'Error/s found!<br />Please check the Errors Table for details...');
        return;
      }

      await this.$store.dispatch("syntax/ANALYZE");
      const syntaxErrors = this.$store.getters['syntax/errors'];
      if (syntaxErrors.length) {
        this.playLoading = false;
        this.displayAlert('error', 'Error/s found!<br />Please check the Errors Table for details...');
        return;
      }

      this.playLoading = false;
      this.displayAlert('success', 'Run success!<br />No errors found!');
    },
  },
  computed: {
    lexemeTable() {
      return this.$store.getters["tokenizer/tokens"];
    },
    errorTable() {
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
/* required class */
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;
  height: 100%;
  padding: 15px;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>
