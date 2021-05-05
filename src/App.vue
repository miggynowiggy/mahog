<template>
	<v-app>
		<v-app-bar app dark color="primary" height="70px" absolute>
			<v-row align="start" justify="center" wrap class="pt-3">
				<v-col cols="1">
					<v-img
						:src="require('@/assets/logo_transparent_white.png')"
						height="50px"
						width="50px"
					/>
				</v-col>
				<v-col cols="2">
					<p class="text-h3 font-weight-bold">Mahog</p>
				</v-col>
			</v-row>
		</v-app-bar>

		<v-main>
			<v-container fluid fill-height pa-0 dark>
				<Code />
				<!-- <v-row align="center" justify="center" wrap mt-n6>
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
				</v-row> -->
			</v-container>
		</v-main>
		<v-footer app absolute>
			<v-row align="center" justify="center">
				<v-col cols="12" align="center">
					<p class="text-subtitle-1 primary--text darken-2">Mahog © 2021</p>
					<p class="text-body-1 mt-n3 font-italic primary--text darken-2">
						MattyBoi, Huwan, AlekNota, MiggyClutch
					</p>
				</v-col>
			</v-row>
		</v-footer>
	</v-app>
</template>

<script>
	import Code from "@/views/Code.vue";
	// import References from "@/views/References.vue";
	export default {
		created() {
			this.$vuetify.theme.dark = true;
		},
		name: "App",
		components: {
			Code
			// References
		},

		data: () => ({
			currentTab: null,
		})
	};
</script>
