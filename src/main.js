/* Vue */
import Vue from 'vue';

Vue.config.productionTip = false;

import axios from 'axios';
import VueAxios from 'vue-axios';

import Router from '@/router.js';
import App from '@/App.vue';
import Config from '@/config.js';
import BootstrapVue from 'bootstrap-vue';

/** Plugins */
import Util from '@/plugins/handlers/Util.js';

/** css */
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/assets/css/app.css';

Vue.use(BootstrapVue);
Vue.use(VueAxios, axios)
Vue.use(Util);

const vue = new Vue({
	el: "#app",
	router: Router,
	render: h => h(App),

	data() {
		return {
			config: Config,
		}
	},
	mounted: function()
	{
	},
	methods: {
		getGameData: function()
		{
			if (localStorage.bingoGame != null) {
				return JSON.parse(localStorage.bingoGame);
			} else {
				return {};
			}
		},
		saveGameData: function(data) {
			localStorage.bingoGame = JSON.stringify(data);
		},
		setGameData: function(key, data)
		{
			var gameData = this.getGameData();

			gameData[key] = data;
			localStorage.bingoGame = JSON.stringify(gameData);
		}
	}
});

window.app = vue;
