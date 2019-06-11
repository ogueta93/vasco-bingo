import Util from '@/plugins/classes/Util.js';


export default {
	install(Vue, options) {
		Vue.mixin({
			mounted() {
				/** When pluging mounted */
			}
		});

		Util.options = options;

		Vue.prototype.$util = Util;
	},
};