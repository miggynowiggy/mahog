import Vue from "vue";
import Vuex from "vuex";
import lexical from "./modules/lexical";
import syntax from "./modules/syntax";
import tokenizer from "./modules/tokenizer";
import errors from './modules/errors';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		toggleDarkMode: false,
	},
	getters: {
		darkMode: (state) => state.darkMode,
	},
	mutations: {
		TOGGLE_THEME(state) {
			state.toggleDarkMode = !state.toggleDarkMode;
		},
	},
	actions: {},
	modules: {
		lexical,
		syntax,
		tokenizer,
		errors
	},
});
