import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

// createApp(App).mount('#app')
const app = createApp(App)
app.config.globalProperties.$axios = axios
app.mount('#app')