<template>
	<v-container height="90vh" fluid py-10>
		<v-row align="center" justify="space-around" wrap>
			<v-col sm="12" md="5" lg="5" cols="5">
				<v-card outline elevation="12" height="80vh">
					<v-card-title class="text-h4 font-weight-bold primary--text">
						Reserved Words
					</v-card-title>
					<v-divider></v-divider>
					<v-container fluid pa-0>
						<v-data-table
							:headers="keywordHeaders"
							:items="keywords"
							:items-per-page="-1"
						></v-data-table>
					</v-container>
				</v-card>
			</v-col>
			<v-col sm="12" md="5" lg="5" cols="5">
				<v-card outline elevation="12" height="80vh">
					<v-card-title class="text-h4 font-weight-bold primary--text">
						Reserved Symbols
					</v-card-title>
					<v-divider></v-divider>
					<v-container fluid pa-0>
						<v-data-table
							:header="symbolHeader"
							:items="symbols"
							:items-per-page="-1"
						></v-data-table>
					</v-container>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		name: "References",
		data: () => ({
			keywords: [],
			keywordsHeader: [
				{ text: "Keyword", value: "keyword", sortable: true, align: "center" },
				{
					text: "description",
					value: "description",
					sortable: false,
					align: "center",
				},
			],
			symbols: [],
			symbolsHeader: [
				{ text: "Symbol", value: "symbol", sortable: true, align: "center" },
				{ text: "Name", value: "name", sortable: true, align: "center" },
				{
					text: "description",
					value: "description",
					sortable: false,
					align: "center",
				},
			],
		}),
	};
</script>

<style></style>
