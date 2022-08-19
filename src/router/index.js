import Vue from 'vue'
import Router from 'vue-router'
import game from '@/view/game/game-2048.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: game
    }
  ]
})
