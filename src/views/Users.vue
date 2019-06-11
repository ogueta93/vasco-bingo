<template>
	<div class="wfgApi">
		<h1>User</h1>
	</div>
</template>

<script>
export default {
	name : 'userView',
	data() {
		return {
			url: 'game/orm',
			data: null
		}
	},
	mounted: function()
	{
		/** Initial module instance */
		var that = this;

		this.axios.get(this.$root.config.baseUrl + this.url, {
			headers: {
				'X-AUTH-TOKEN': that.$root.getUserData().token
			}
		})
		.then(function (response) {
			that.$root.processResponse(response, function(){
				that.data = response.data;
			});
		})
		.catch(function (error) {
			that.$root.processError(error.response);
		});
	},
	updated: function()
	{
		/** after render */
	},
	methods: {
		
	}
};
</script>