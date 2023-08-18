import * as VueRouter from 'vue-router'
import Login from './pages/Login.vue'
import Main from './pages/Main.vue'

export default VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        { path: '/', component: Main },
        { path: '/login', component: Login }
    ]
})