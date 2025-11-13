import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import { createRouter, createMemoryHistory } from 'vue-router';
import Home from "./views/Home.vue";
import Conversation from "./views/Conversation.vue";
import Setting from "./views/Setting.vue";

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

createApp(App).use(router).mount('#app');
