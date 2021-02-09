<template>
	<v-app>
		<v-app-bar app dark color="primary">
			<v-app-bar-title
				><p class="text-h4 mt-2 font-weight-bold white--text">
					Mahog
				</p></v-app-bar-title
			>
		</v-app-bar>
		<v-main>
			<v-container fluid fill-height pa-0 mt-3>
				<v-row align="center" justify="center" wrap mt-n6>
					<v-col cols="12">
						<v-tabs
							v-model="currentTab"
							background-color="primary"
							active-class="white--text"
							centered
							dark
							grow
							slider-size="5"
							icons-and-text
						>
							<v-tabs-slider></v-tabs-slider>
							<v-tab href="#code">
								Code
								<v-icon>code</v-icon>
							</v-tab>
							<v-tab href="#reference">
								Reference
								<v-icon>book</v-icon>
							</v-tab>

							<v-tabs-items v-model="currentTab">
								<v-tab-item value="code">
									<Code />
								</v-tab-item>

								<v-tab-item value="reference">
									<References />
								</v-tab-item>
							</v-tabs-items>
						</v-tabs>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
		<v-footer class="grey lighten-4" height="40px">
			<v-row align="center" justify="center">
				<v-col cols="12" align="center">
					<p class="text-subtitle-1 primary--text darken-2">Mahog © 2021</p>
				</v-col>
			</v-row>
		</v-footer>
	</v-app>
</template>

<script>
	import Code from "@/views/Code.vue";
	import References from "@/views/References.vue";
	export default {
		name: "App",
		components: { Code, References },

		data: () => ({
			currentTab: null,
		}),

		watch: {
			currentTab(val) {
				console.log(val);
			},
		},
	};
</script>
