import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "font-awesome/css/font-awesome.min.css";

const vuetify = new Vuetify({
	icons: {
		iconfont: "md" || "fa" || "mdi",
	},
	theme: {
		themes: {
			dark: {
				primary: "#C0AD74",
				secondary: "#1CC8EE",
				error: "#db2f2e",
				accent: "#f7d253",
			},
		},
	},
});

Vue.use(Vuetify);

export default vuetify;
