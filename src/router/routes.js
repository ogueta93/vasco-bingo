/** Views */
import bingo from '@/views/Bingo.vue';
import users from '@/views/Users.vue';

const routes = [
  { 
    path: '/', component: bingo, 
  },
  { 
    path: '/users', component: users
  },
];

export default routes;