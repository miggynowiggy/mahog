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
					"A data type that holds the value of stirng or a character.",
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
				description:
					"A special type that represents the absence of a value, only applicable for defining data type on functions",
			},
		],
	},
	getters: {
		keywords: (state) => state.keywords,
	},
};
