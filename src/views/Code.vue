<template>
	<v-container fluid pa-0 fill-height class="pt-3">
		<v-row align="center" justify="space-between" class="pa-2">
			<v-col cols="7">
				<v-card height="80vh" class="pa-2" elevation="12">
					<prism-editor
						class="my-editor"
						v-model="code"
						:highlight="highlight"
						line-numbers
					></prism-editor>
				</v-card>
			</v-col>
			<v-col cols="5">
				<v-card height="80vh" class="pa-2">
					<v-card-title class="text-h4 font-weight-bold primary--text">
						Some Code you type
					</v-card-title>
					<v-card-text>
						<div v-for="(token, index) in code.split('\n')" :key="index">
							{{ token }}
						</div>
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

	export default {
		name: "Code",
		components: { PrismEditor },
		data: () => ({
			code: "?Type your code here",
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
		padding: 10px;

		/* you must provide font-family font-size line-height. Example: */
		font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
	}

	/* optional class for removing the outline */
	.prism-editor__textarea:focus {
		outline: none;
	}
</style>
