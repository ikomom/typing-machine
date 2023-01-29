import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App  from './App.vue'

const router = createRouter({
    history: createWebHistory(),
    routes,
})
app.mount('#app')

app.use(router)
