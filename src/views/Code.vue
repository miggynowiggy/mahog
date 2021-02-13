<template>
	<v-container fluid py-10 fill-height>
		<v-row align="center" justify="space-around" class="pa-2">
			<!-- The code editor on the left -->
			<v-col xs="12" sm="12" md="6" lg="6" cols="6">
				<v-card height="80vh" class="pa-2" elevation="24">
					<prism-editor
						class="my-editor"
						v-model="code"
						:highlight="highlight"
						line-numbers
					></prism-editor>
				</v-card>
			</v-col>
			<!-- The run, stop, clear button in the middle -->
			<v-col cols="12" sm="12" md="1" lg="1">
				<v-row align="center" justify="center" wrap>
					<v-col xs="10" sm="10" md="12" lg="12" align="center">
						<v-tooltip right>
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									:icon="$vuetify.breakpoint.mdAndUp"
									:block="$vuetify.breakpoint.smAndDown"
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
								>
									<v-icon x-large>cancel</v-icon>
								</v-btn>
							</template>
							<span class="text-subtitle-1">Stop Code</span>
						</v-tooltip>
					</v-col>
					<v-col xs="10" sm="10" md="12" lg="12" align="center">
						<v-tooltip right>
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
						<v-card height="55vh" class="pa-2" elevation="13">
							<v-card-title class="text-h4 font-weight-bold primary--text">
								Lexeme Table
							</v-card-title>
							<v-card-text>
								<v-data-table
									dense
									:headers="lexemeHeader"
									:items="lexemeTable"
									disable-sort
									:items-per-page="5"
								></v-data-table>
							</v-card-text>
						</v-card>
					</v-col>
					<v-col cols="12">
						<!-- The Syntax Analysis Card -->
						<v-card height="35vh" class="pa-2" elevation="13">
							<v-card-title class="text-h4 font-weight-bold primary--text">
								Syntax Analysis
							</v-card-title>
							<v-card-text>
								<v-data-table
									dense
									:headers="syntaxHeader"
									:items="syntaxes"
									disable-sort
									:items-per-page="-1"
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
	// import Prism Editor
	import { PrismEditor } from "vue-prism-editor";
	import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

	// import highlighting library (you can use any library you want just return html string)
	import { highlight, languages } from "prismjs/components/prism-core";
	import "prismjs/components/prism-clike";
	import "prismjs/components/prism-javascript";
	import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles

	export default {
		name: "Code",
		components: { PrismEditor },
		data: () => ({
			code: `stone miggy = "waw this";\nduring(true) {\n\twater('qaqu!')\n}\n\nnumber age;\nif(miggy > 2) {\n\tnumber = 12;\n} elif(miggy == 'cream') {\n\tnumber = 11 - 2;\n} else {\n\tnumber = 0 - -12;\n}\n\nage++;\n\n\n@line Comment \n\nboolean totoo = logicA != 21;\nboolean another_22_u = !totoo;\nage = 12.345;\nage = 21;\n\nstr = 'wawers';`,
			lexemeHeader: [
				{ text: "Line", align: "center", sortable: "false", value: "line" },
				{ text: "Lexeme", align: "center", sortable: "false", value: "lexeme" },
				{ text: "-->", align: "center", sortable: "false", value: "" },
				{
					text: "Token",
					align: "center",
					sortable: "false",
					value: "token",
				},
			],
			lexemes: [],
			syntaxHeader: [
				{ text: "Error Code", align: "center", sortable: "false", value: "" },
				{ text: "Message", align: "center", sortable: "false", value: "" },
			],
			syntaxes: [],
		}),
		mounted() {
			this.runCode();
		},
		methods: {
			highlight(code) {
				return highlight(code, languages.js);
			},
			clearEditor() {
				this.code = "";
			},
			async runCode() {
				await this.$store.dispatch("lexical/ANALYZE", this.code);
				await this.$store.dispatch("syntax/ANALYZE", this.code);
			},
		},
		computed: {
			lexemeTable() {
				return this.$store.getters["lexical/lexemes"];
			},
		},
		watch: {},
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
