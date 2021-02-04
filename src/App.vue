<template>
	<v-app>
		<v-main>
			<router-view></router-view>
		</v-main>
		<v-footer class="grey lighten-3">
			<v-row align="center" justify="center">
				<v-col cols="12" align="center">
					<p class="text-body-2">Mahog © 2021</p>
				</v-col>
			</v-row>
		</v-footer>
	</v-app>
</template>

<script>
	export default {
		name: "App",

		data: () => ({
			//
		}),
	};
</script>
