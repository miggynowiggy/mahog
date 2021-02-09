<template>
	<v-container fluid py-10 fill-height>
		<v-row align="center" justify="space-around" class="pa-2">
			<v-col sm="12" md="6" lg="6" cols="6">
				<v-card height="80vh" class="pa-2" elevation="24">
					<prism-editor
						class="my-editor"
						v-model="code"
						:highlight="highlight"
						line-numbers
					></prism-editor>
				</v-card>
			</v-col>
			<v-col sm="12" md="5" lg="5" cols="5">
				<v-row align="center" justify="center" wrap>
					<v-col cols="12">
						<v-card height="45vh" class="pa-2" elevation="13">
							<v-card-title class="text-h4 font-weight-bold primary--text">
								Lexeme Table
							</v-card-title>
							<v-container>
								<v-data-table
									:headers="lexemeHeader"
									:items="lexemes"
									disable-sort
									:items-per-page="-1"
								></v-data-table>
							</v-container>
						</v-card>
					</v-col>
					<v-col cols="12">
						<v-card height="35vh" class="pa-2" elevation="13">
							<v-card-title class="text-h4 font-weight-bold primary--text">
								Syntax Analysis
							</v-card-title>
							<v-card-text>
								<v-data-table
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
			code: "?Type your code here",
			lexemeHeader: [
				{ text: "Line", align: "center", sortable: "false", value: "" },
				{ text: "Lexeme", align: "center", sortable: "false", value: "" },
				{ text: "-->", align: "center", sortable: "false", value: "" },
				{ text: "Token", align: "center", sortable: "false", value: "" },
			],
			lexemes: [],
			syntaxHeader: [
				{ text: "Error Code", align: "center", sortable: "false", value: "" },
				{ text: "Message", align: "center", sortable: "false", value: "" },
			],
			syntaxes: [],
		}),
		methods: {
			highlight(code) {
				return highlight(code, languages.js);
			},
		},
		watch: {
			code(val) {
				console.log(val);
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
