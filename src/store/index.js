import Vue from "vue";
import Vuex from "vuex";
import keywords from "./modules/keywords";
import symbols from "./modules/symbols";

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
		keywords,
		symbols,
	},
});
