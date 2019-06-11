<template>
	<div class="wfgApi">
		<h1>Diego</h1>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				data: null
			}
		},
		methods: {
			getData: function()
			{	
				var that = this;
				this.$http.get('http://vascoframework.es/Test/Caca', {
				}).then(function(response){
					that.data = response.body;
					console.log(that.data,'diego');
				}, function(response){
					that.$util.processAccessError(response.body);
				});
			},
		},
		created: function()
		{
			/** Initial module instance */
		},
		updated: function()
		{
			/** after render */
		}
	};
</script>
