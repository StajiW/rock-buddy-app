import * as VueRouter from 'vue-router'
import Account from './pages/Account.vue'
import Activation from './pages/Activation.vue'
import Login from './pages/Login.vue'

export default VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        { path: '/', component: Login },
        { path: '/account', component: Account },
        { path: '/home', component: Activation }
    ]
})