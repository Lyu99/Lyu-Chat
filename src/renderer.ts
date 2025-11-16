import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import { createRouter, createMemoryHistory } from 'vue-router';
import Home from "./views/Home.vue";
import Conversation from "./views/Conversation.vue";
import Setting from "./views/Setting.vue";
import { createPinia } from 'pinia';
import { useConversationStore } from "./store/conversation";

const pinia = createPinia()
const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/conversation/:id',
        component: Conversation
    },
    {
        path: '/setting',
        component: Setting
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
});

router.beforeEach((to) => {
    const store = useConversationStore();
    if(!to.path.startsWith("/conversation/")) {
        store.selectId = -1;
    }
})

createApp(App).use(router).use(pinia).mount('#app');
