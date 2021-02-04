import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "font-awesome/css/font-awesome.min.css";

const vuetify = new Vuetify({
	icons: {
		iconfont: "md" || "fa",
	},
	theme: {
		themes: {
			light: {
				primary: "#E0CC91",
				secondary: "#1CC8EE",
				error: "#b71c1c",
			},
		},
	},
});

Vue.use(Vuetify);

export default vuetify;
