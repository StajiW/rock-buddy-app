import * as VueRouter from 'vue-router'
import Main from './pages/Main.vue'
import Login from './pages/Login.vue'
import Rankings from './pages/Rankings.vue'

export default VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', component: Main },
        { path: '/login', component: Login },
        { path: '/rankings', component: Rankings }
    ]
})